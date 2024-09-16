// next-amazona-v2/app/api/discounts/check/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DiscountModel from '@/lib/models/DiscountModel';
import { auth } from '@/lib/auth'; // Import auth

export const POST = async (req: Request) => {
  await dbConnect();

  try {
    // Pobierz sesję użytkownika za pomocą auth()
    const session = await auth();

    // Jeśli nie ma sesji, zwróć odpowiedź 401 Unauthorized
    if (!session || !session.user) {
      return NextResponse.json(
        { valid: false, message: 'Nie jesteś zalogowany.' },
        { status: 401 }
      );
    }

    const { code } = await req.json();
    const userId = session.user._id; // Pobierz ID użytkownika z sesji

    // Znajdź rabat w bazie danych po kodzie
    const discount = await DiscountModel.findOne({ code });

    if (!discount || !discount.isActive) {
      return NextResponse.json(
        { valid: false, message: 'Kod rabatowy nie jest aktywny lub nie istnieje' },
        { status: 400 }
      );
    }

    // Sprawdź, czy rabat dotyczy wszystkich użytkowników lub konkretnego użytkownika
    if (discount.users !== 'all' && !discount.users.includes(userId)) {
      return NextResponse.json(
        { valid: false, message: 'Kod rabatowy nie jest przypisany do tego użytkownika' },
        { status: 403 }
      );
    }

    // Sprawdź, czy rabat nie wygasł
    if (discount.expirationDate && new Date(discount.expirationDate) < new Date()) {
      return NextResponse.json(
        { valid: false, message: 'Kod rabatowy wygasł' },
        { status: 400 }
      );
    }

    // Zwróć informacje o rabacie, w tym typ rabatu
    return NextResponse.json(
      { valid: true, discountAmount: discount.value, type: discount.type },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { valid: false, message: 'Wystąpił błąd serwera' },
      { status: 500 }
    );
  }
};
