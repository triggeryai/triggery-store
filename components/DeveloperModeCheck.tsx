export default function DeveloperModeCheck() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Tryb Deweloperski Włączony</h1>
        <p className="text-lg">Ta strona jest obecnie w trybie deweloperskim. Prosimy o sprawdzenie później.</p>
      </div>
    </div>
  );
}
