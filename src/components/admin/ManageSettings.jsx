import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const ManageSettings = () => {
  const { settings, setSettings } = useData();
  const [localSettings, setLocalSettings] = useState(settings);
  const { toast } = useToast();

  const handleSave = () => {
    setSettings(localSettings);
    toast({ title: "Succès", description: "Paramètres sauvegardés." });
  };

  return (
    <div>
      <h2 className="text-2xl font-orbitron font-bold text-cyan-300 mb-6">
        PARAMÈTRES GÉNÉRAUX
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Liens WhatsApp</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-cyan-400 mb-2 block">Groupe MJ</Label>
              <Input
                value={localSettings.whatsappMj}
                onChange={(e) => setLocalSettings(p => ({ ...p, whatsappMj: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-cyan-400 mb-2 block">Groupe BR</Label>
              <Input
                value={localSettings.whatsappBr}
                onChange={(e) => setLocalSettings(p => ({ ...p, whatsappBr: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-cyan-400 mb-2 block">Numéro FAQ</Label>
              <Input
                value={localSettings.faqWhatsapp}
                onChange={(e) => setLocalSettings(p => ({ ...p, faqWhatsapp: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="cyber-button">
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};

export default ManageSettings;