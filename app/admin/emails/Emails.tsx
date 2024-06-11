// app\admin\emails\Emails.tsx
"use client";
"use client";
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({ from: '', subject: '', html: '' });
  const [error, setError] = useState(null);

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
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Email Templates</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <select onChange={(e) => {
        const template = templates.find(t => t.templateName === e.target.value);
        setSelectedTemplate(template || null);
      }}>
        <option value="">Select Template</option>
        {templates.map((template) => (
          <option key={template._id} value={template.templateName}>{template.templateName}</option>
        ))}
      </select>
      {selectedTemplate && (
        <>
          <div>
            <label>From</label>
            <input
              type="text"
              value={form.from}
              onChange={(e) => setForm({ ...form, from: e.target.value })}
            />
          </div>
          <div>
            <label>Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div>
            <label>HTML</label>
            <textarea
              value={form.html}
              onChange={(e) => setForm({ ...form, html: e.target.value })}
            />
          </div>
          <button onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
}
