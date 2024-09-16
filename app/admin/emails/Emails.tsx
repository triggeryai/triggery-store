"use client";
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({ from: '', subject: '', html: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Zmienna kontrolująca stan ładowania
  const [isSaving, setIsSaving] = useState(false); // Zmienna kontrolująca stan zapisywania

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const session = await getSession();
        const response = await fetch('/api/admin/emails', {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`, // Assuming the token is available in the session
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Data is not an array');
        }
        setTemplates(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Przestajemy ładować dane
      }
    }
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      setForm({
        from: selectedTemplate.from,
        subject: selectedTemplate.subject,
        html: selectedTemplate.html,
      });
    }
  }, [selectedTemplate]);

  const handleSave = async () => {
    setIsSaving(true); // Rozpoczynamy zapisywanie
    try {
      const session = await getSession();
      const response = await fetch(`/api/admin/emails`, {
        method: selectedTemplate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`, // Assuming the token is available in the session
        },
        body: JSON.stringify({
          id: selectedTemplate?._id,
          update: form,
          templateName: selectedTemplate?.templateName || form.templateName,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === data._id ? data : template
        )
      );
      setSelectedTemplate(null);
      setForm({ from: '', subject: '', html: '' });
      toast.success('Szablon został zapisany');
    } catch (error) {
      setError(error.message);
      toast.error('Błąd podczas zapisywania szablonu');
    } finally {
      setIsSaving(false); // Kończymy zapisywanie
    }
  };

  // Spinner ładowania
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Szablony Email</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block">Wybierz szablon</label>
        <select 
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => {
            const template = templates.find(t => t.templateName === e.target.value);
            setSelectedTemplate(template || null);
          }}
        >
          <option value="">Wybierz szablon</option>
          {templates.map((template) => (
            <option key={template._id} value={template.templateName}>{template.templateName}</option>
          ))}
        </select>
      </div>
      {selectedTemplate && (
        <>
          <div className="mb-4">
            <label>Od</label>
            <input
              type="text"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label>Temat</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label>HTML</label>
            <textarea
              value={form.html}
              onChange={(e) => setForm({ ...form, html: e.target.value })}
              className="textarea textarea-bordered w-full"
              rows="10"
            />
          </div>
          <button 
            onClick={handleSave} 
            className="btn btn-primary" 
            disabled={isSaving} // Przycisk zapisywania jest zablokowany podczas zapisywania
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz'}
          </button>
        </>
      )}
    </div>
  );
}
