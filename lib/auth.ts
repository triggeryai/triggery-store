// next-amazona-v2/lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './dbConnect';
import UserModel from './models/UserModel';
import bcrypt from 'bcrypt'; // Importujemy bcrypt do hashowania
import NextAuth from 'next-auth';

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials) {
          console.log("Brak danych logowania");
          return null;
        }

        console.log("Szukam użytkownika:", credentials.email);
        const user = await UserModel.findOne({ email: credentials.email });

        if (!user) {
          console.log("Nie znaleziono użytkownika:", credentials.email);
          return null;
        }

        // Sprawdzanie hasła użytkownika za pomocą bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        
        if (isPasswordValid) {
          console.log("Użytkownik autoryzowany");
          return user; // Zwracamy użytkownika po poprawnej weryfikacji
        } else {
          console.log("Hasło niepoprawne");
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/signin',
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      } else {
        await dbConnect();
        const existingUser = await UserModel.findById(token.user._id);
        if (!existingUser) {
          console.log("Użytkownik nie istnieje");
          return {};
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        await dbConnect(); // Upewnij się, że dane sesji są aktualizowane z bazy danych
        const user = await UserModel.findById(token.user._id);
        if (user) {
          session.user = {
            _id: user._id,
            email: user.email,  // Aktualizacja emaila w sesji
            name: user.name,
            isAdmin: user.isAdmin,
          };
        }
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
