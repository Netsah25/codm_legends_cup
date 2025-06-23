import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const ManageNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Charger toutes les actualités
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('news').select('*').order('id');
      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      } else if (data) {
        setNewsList(data);
      }
      setLoading(false);
    };
    fetchNews();
  }, [toast]);

  // Modifier une actualité dans la liste locale
  const handleChange = (index, field, value) => {
    const updated = [...newsList];
    updated[index][field] = value;
    setNewsList(updated);
  };

  // Ajouter une nouvelle actualité vide
  const handleAdd = () => {
    setNewsList([...newsList, { title: '', content: '' }]);
  };

  // Sauvegarder toutes les actualités (upsert)
  const handleSaveAll = async () => {
    setLoading(true);

    // Validation simple : au moins titre et contenu non vide
    for (const news of newsList) {
      if (!news.title?.trim() || !news.content?.trim()) {
        toast({ title: 'Erreur', description: 'Chaque actualité doit avoir un titre et un contenu.', variant: 'destructive' });
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from('news').upsert(newsList);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Succès', description: 'Actualités mises à jour.' });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-orbitron font-bold text-cyan-300 mb-6">GESTION DES ACTUALITÉS</h2>

      {newsList.map((news, idx) => (
        <div key={news.id ?? idx} className="mb-6 border border-cyan-500 p-4 rounded bg-black">
          <Label htmlFor={`title-${idx}`} className="text-cyan-400 mb-1 block">Titre</Label>
          <input
            id={`title-${idx}`}
            type="text"
            className="w-full p-2 mb-3 rounded bg-black border border-cyan-500 text-white"
            value={news.title || ''}
            onChange={(e) => handleChange(idx, 'title', e.target.value)}
            disabled={loading}
          />

          <Label htmlFor={`content-${idx}`} className="text-cyan-400 mb-1 block">Contenu</Label>
          <textarea
            id={`content-${idx}`}
            className="w-full p-3 rounded bg-black border border-cyan-500 text-white min-h-[100px]"
            value={news.content || ''}
            onChange={(e) => handleChange(idx, 'content', e.target.value)}
            disabled={loading}
          />
        </div>
      ))}

      <Button onClick={handleAdd} className="mb-4 cyber-button" disabled={loading}>
        Ajouter une actualité
      </Button>

      <Button onClick={handleSaveAll} className="cyber-button" disabled={loading}>
        {loading ? 'Chargement...' : 'Enregistrer toutes les actualités'}
      </Button>
    </div>
  );
};

export default ManageNews;
