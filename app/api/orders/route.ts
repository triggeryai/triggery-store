// next-amazona-v2/app/api/orders/route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel, { OrderItem } from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import ShippingOption from '@/lib/models/ShippingPriceModel';
import { round2, getGuestCheckoutStatus } from '@/lib/utils';
import mongoose from 'mongoose';
import Tax from '@/lib/models/TaxModel';
import DiscountModel from '@/lib/models/DiscountModel'; // Import the Discount model

// Funkcja do obliczania cen zamówienia (produkty, wysyłka, podatek, rabaty)
const calcPrices = (
  orderItems: OrderItem[],
  shippingCost: number,
  taxSettings: { isActive: boolean; type: string; value: number },
  discount: { value: number; type: string } | null
) => {
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate tax only if active
  let taxPrice = 0;
  if (taxSettings.isActive) {
    taxPrice =
      taxSettings.type === 'percentage'
        ? round2((itemsPrice * taxSettings.value) / 100)
        : round2(taxSettings.value);
  }

  // Discount handling (fixed amount or free shipping)
  let finalShippingCost = shippingCost;
  let discountValue = 0;
  let isFreeShipping = false;

  if (discount && discount.type === 'free_shipping') {
    finalShippingCost = 0; // Free shipping
    isFreeShipping = true; // Indicate free shipping for the frontend
  }

  if (discount && discount.type === 'fixed') {
    discountValue = discount.value;
  }

  // Calculate total price before applying discount
  let totalPriceBeforeDiscount = itemsPrice + finalShippingCost + taxPrice;

  // Ensure that the discount does not exceed the total price
  if (discountValue > totalPriceBeforeDiscount) {
    discountValue = totalPriceBeforeDiscount; // Cap discount at total price
  }

  // Calculate the final total price
  let totalPrice = round2(totalPriceBeforeDiscount - discountValue);

  // Ensure the total price is not negative
  if (totalPrice < 0) {
    totalPrice = 0; // Cap at zero
  }

  return {
    itemsPrice,
    shippingPrice: finalShippingCost,
    taxPrice,
    totalPrice,
    discountValue,
    isFreeShipping,
  };
};

// Funkcja do obliczania liczby paczek na podstawie objętości i wagi
const calculateNumOfPackages = (items: OrderItem[], shippingOption: any) => {
  if (shippingOption.value === 'Odbior osobisty') {
    return 1;
  }

  const { width, height, depth, weight: boxWeightLimit } = shippingOption;
  let totalVolume = 0;
  let totalWeight = 0;

  items.forEach((item) => {
    const productVolume = item.width * item.height * item.depth * item.qty;
    const productWeight = item.weight * item.qty;
    totalVolume += productVolume;
    totalWeight += productWeight;
  });

  const packageVolume = width * height * depth;
  const volumePackages = Math.ceil(totalVolume / packageVolume);
  const weightPackages = Math.ceil(totalWeight / boxWeightLimit);

  return Math.max(volumePackages, weightPackages);
};

export const POST = auth(async (req: any) => {
  await dbConnect();

  const isGuestCheckoutEnabled = await getGuestCheckoutStatus();

  if (!isGuestCheckoutEnabled && !req.auth) {
    return new Response(
      JSON.stringify({
        message: 'Guest checkout is disabled and user is not logged in',
      }),
      {
        status: 403,
      }
    );
  }

  const { user } = req.auth || {};

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payload = await req.json();

    // Ensure that the shipping cost is valid
    if (typeof payload.shippingAddress.shippingCost !== 'number') {
      throw new Error('Invalid shipping cost provided');
    }

    // Pobranie opcji wysyłki (np. Inpost, DHL)
    const shippingMethod = payload.shippingAddress.shippingMethod;
    const shippingOption = await ShippingOption.findOne({ value: shippingMethod });
    if (!shippingOption) {
      throw new Error('Invalid shipping method provided');
    }

    // Pobranie ustawień podatkowych
    const taxSettings = await Tax.findOne();
    if (!taxSettings) {
      throw new Error('Tax settings not found');
    }

    // Weryfikacja kodu rabatowego (jeśli podano)
    let appliedDiscount = null;
    if (payload.discountCode) {
      const discount = await DiscountModel.findOne({ code: payload.discountCode });
      if (!discount || !discount.isActive) {
        throw new Error('Invalid or inactive discount code');
      }

      // Sprawdź, czy użytkownik kwalifikuje się do rabatu
      if (discount.users !== 'all' && user && !discount.users.includes(user._id)) {
        throw new Error('This discount is not available for you');
      }

      // Sprawdź datę wygaśnięcia
      if (discount.expirationDate && new Date(discount.expirationDate) < new Date()) {
        throw new Error('Discount code has expired');
      }

      appliedDiscount = discount;
    }

    // Sprawdzanie rabatów automatycznych (bez kodu)
    const automaticDiscount = await DiscountModel.findOne({
      code: { $exists: false }, // Automatyczne rabaty bez kodu
      isActive: true,
      users: { $in: ['all', user?._id] },
    });

    // Sumowanie rabatów: jeśli istnieje rabat automatyczny, ale kod ma wyższy priorytet
    const discountToApply = appliedDiscount || automaticDiscount || null;

    // Pobieranie danych o produktach z bazy danych
    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
      },
      'price countInStock width height depth weight'
    ).session(session);

    // Sprawdzanie poprawności wymiarów i wagi produktów
    for (const product of dbProductPrices) {
      if (product.width === 0 || product.height === 0 || product.depth === 0 || product.weight === 0) {
        throw new Error(`Product "${product._id}" has invalid dimensions or weight. Please update the product settings.`);
      }
    }

    const dbOrderItems = payload.items.map((item: any) => {
      const product = dbProductPrices.find((p) => p._id.equals(item._id));
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.countInStock < item.qty) {
        throw new Error('Not enough stock');
      }
      return {
        ...item,
        product: item._id,
        price: product.price,
        width: product.width,
        height: product.height,
        depth: product.depth,
        weight: product.weight,
        _id: undefined,
      };
    });

    for (const item of dbOrderItems) {
      await ProductModel.updateOne(
        { _id: item.product },
        { $inc: { countInStock: -item.qty } }
      ).session(session);
    }

    const numOfPackages = calculateNumOfPackages(dbOrderItems, shippingOption);

    // Obliczamy ceny (produkty, wysyłka, podatek, rabat)
    const { itemsPrice, taxPrice, shippingPrice, totalPrice, discountValue, isFreeShipping } = calcPrices(
      dbOrderItems,
      payload.shippingAddress.shippingCost,
      taxSettings,
      discountToApply ? { value: discountToApply.value, type: discountToApply.type } : null
    );

    // Sprawdzenie, czy użytkownik jest zalogowany lub gość, i przypisanie emaila
    const email = user?.email || payload.shippingAddress.email;

    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discountValue, // Zapisujemy kwotę rabatu
      shippingAddress: {
        ...payload.shippingAddress,
        numOfPackages,
      },
      paymentMethod: payload.paymentMethod,
      user: user ? user._id : null,
      email, // Dla gości
    });

    const createdOrder = await newOrder.save({ session });
    await session.commitTransaction();

    // Zwracamy przeliczone dane zamówienia, w tym ceny, rabaty i informację o darmowej wysyłce
    return new Response(
      JSON.stringify({
        message: 'Order has been created',
        order: createdOrder,
        prices: { itemsPrice, taxPrice, shippingPrice, totalPrice, discountValue, isFreeShipping }
      }),
      {
        status: 201,
      }
    );
  } catch (err: any) {
    await session.abortTransaction();
    return new Response(
      JSON.stringify({ message: err.message || 'An error occurred' }),
      {
        status: 500,
      }
    );
  } finally {
    session.endSession();
  }
}) as any;
