import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';


const ManageRules = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [localRules, setLocalRules] = useState({
    general: '',
    mj: '',
    br: '',
  });

  // Charger les règles depuis Supabase
  useEffect(() => {
    const fetchRules = async () => {
      const { data, error } = await supabase.from('rules').select('*');
      if (error) {
        toast({ title: 'Erreur', description: "Impossible de charger les règles." });
        return;
      }

      const rulesByMode = {
        general: '',
        mj: '',
        br: '',
      };

      data.forEach(rule => {
        if (rule.mode && rulesByMode.hasOwnProperty(rule.mode)) {
          rulesByMode[rule.mode] = rule.content;
        }
      });

      setLocalRules(rulesByMode);
    };

    fetchRules();
  }, [toast]);

  // Mise à jour ou insertion d'une règle
  const updateRuleInDB = async (mode, content) => {
    const { data: existingRule, error: selectError } = await supabase
      .from('rules')
      .select('id')
      .eq('mode', mode)
      .maybeSingle(); // safe même si aucune ligne

    if (selectError) throw selectError;

    if (existingRule) {
      const { error: updateError } = await supabase
        .from('rules')
        .update({ content })
        .eq('id', existingRule.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('rules')
        .insert({ mode, content });

      if (insertError) throw insertError;
    }
  };

  // Sauvegarde toutes les règles
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateRuleInDB('general', localRules.general.trim());
      await updateRuleInDB('mj', localRules.mj.trim());
      await updateRuleInDB('br', localRules.br.trim());

      toast({ title: "Succès", description: "Règles mises à jour avec succès." });
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Échec lors de la sauvegarde des règles." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-orbitron font-bold text-cyan-300 mb-6">
        GESTION DES RÈGLES
      </h2>
      <div className="space-y-6">
        <div>
          <Label className="text-cyan-400 mb-2 block">Règles Générales</Label>
          <Textarea
            value={localRules.general}
            onChange={(e) => setLocalRules(prev => ({ ...prev, general: e.target.value }))}
            rows={6}
          />
        </div>
        <div>
          <Label className="text-cyan-400 mb-2 block">Règles Techniques MJ</Label>
          <Textarea
            value={localRules.mj}
            onChange={(e) => setLocalRules(prev => ({ ...prev, mj: e.target.value }))}
            rows={6}
          />
        </div>
        <div>
          <Label className="text-cyan-400 mb-2 block">Règles Techniques BR</Label>
          <Textarea
            value={localRules.br}
            onChange={(e) => setLocalRules(prev => ({ ...prev, br: e.target.value }))}
            rows={6}
          />
        </div>
        <Button onClick={handleSave} disabled={loading} className="cyber-button">
          {loading ? 'Sauvegarde en cours...' : 'Sauvegarder les règles'}
        </Button>
      </div>
    </div>
  );
};

export default ManageRules;
