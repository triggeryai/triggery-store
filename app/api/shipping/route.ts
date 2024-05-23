import dbConnect from '@/lib/dbConnect';
import ShippingOption from '@/lib/models/ShippingPriceModel';

const defaultShippingOptions = [
  { value: "Inpost Paczkomat", label: "Inpost Paczkomat - $5", price: 5 },
  { value: "Pocztex Poczta Polska Kurier", label: "Pocztex Poczta Kurier - $7", price: 7 },
  { value: "Pocztex Poczta Odbior Punkt", label: "Pocztex Poczta Odbior Punkt - $7", price: 7 },
  { value: "Inpost Kurier", label: "Inpost Kurier - $10", price: 10 },
  { value: "DPD Kurier", label: "DPD Kurier - $12", price: 12 },
  { value: "DHL Kurier", label: "DHL Kurier - $15", price: 15 },
  { value: "Odbior osobisty", label: "Odbior osobisty - $0", price: 0 },
];

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    let shippingOptions = await ShippingOption.find({});
    if (shippingOptions.length === 0) {
      // Insert default options if none exist
      shippingOptions = await ShippingOption.insertMany(defaultShippingOptions);
    }
    res.status(200).json(shippingOptions);
  }
  
  if (req.method === 'POST') {
    const { value, label, price } = req.body;
    const newOption = new ShippingOption({ value, label, price });
    await newOption.save();
    res.status(201).json(newOption);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    await ShippingOption.findByIdAndDelete(id);
    res.status(204).end();
  }
}
