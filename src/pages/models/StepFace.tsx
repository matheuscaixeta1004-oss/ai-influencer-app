import { useCallback } from 'react';
import { Card, UploadZone, Badge } from '../../components/ui';
import type { ModelFormData } from './CreateModelWizard';

interface Props {
  data: ModelFormData;
  update: (partial: Partial<ModelFormData>) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_PHOTOS = 5;
const MAX_PHOTOS = 20;

export function StepFace({ data, update }: Props) {
  const handleFiles = useCallback((files: File[]) => {
    const valid = files.filter(f => ACCEPTED_TYPES.includes(f.type));
    const totalAllowed = MAX_PHOTOS - data.photos.length;
    const toAdd = valid.slice(0, totalAllowed);

    const newPreviews = toAdd.map(f => URL.createObjectURL(f));
    update({
      photos: [...data.photos, ...toAdd],
      photoPreviews: [...data.photoPreviews, ...newPreviews],
    });
  }, [data.photos, data.photoPreviews, update]);

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(data.photoPreviews[index]);
    update({
      photos: data.photos.filter((_, i) => i !== index),
      photoPreviews: data.photoPreviews.filter((_, i) => i !== index),
    });
  };

  const count = data.photos.length;
  const quality = count === 0 ? 'empty' : count < MIN_PHOTOS ? 'low' : count >= 15 ? 'excellent' : 'good';
  const qualityLabel = { empty: 'Nenhuma foto', low: `${count}/${MIN_PHOTOS} mínimo`, good: 'Bom', excellent: 'Excelente' };
  const qualityColor = { empty: 'default', low: 'danger', good: 'success', excellent: 'primary' } as const;

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-sidebar">Fotos do Rosto</h3>
        <Badge variant={qualityColor[quality]} dot>
          {qualityLabel[quality]} ({count}/{MAX_PHOTOS})
        </Badge>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Upload de {MIN_PHOTOS}–{MAX_PHOTOS} fotos para consistência. JPG, PNG ou WEBP, máx 10MB cada.
      </p>

      {/* Quality indicator bar */}
      <div className="mb-5">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              quality === 'excellent' ? 'bg-primary' :
              quality === 'good' ? 'bg-emerald-500' :
              quality === 'low' ? 'bg-red-400' : 'bg-gray-200'
            }`}
            style={{ width: `${Math.min((count / MAX_PHOTOS) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Photo grid */}
      {count > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-5">
          {data.photoPreviews.map((url, i) => (
            <div key={i} className="relative group aspect-square">
              <img
                src={url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                onClick={() => removePhoto(i)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-sm"
              >
                ✕
              </button>
              {i === 0 && (
                <div className="absolute bottom-1 left-1">
                  <Badge variant="primary">Principal</Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {count < MAX_PHOTOS && (
        <UploadZone
          onFiles={handleFiles}
          accept=".jpg,.jpeg,.png,.webp"
          maxSizeMB={10}
          label={count === 0 ? 'Arraste as fotos do rosto aqui' : 'Adicionar mais fotos'}
          hint={`${MIN_PHOTOS - count > 0 ? `Faltam ${MIN_PHOTOS - count} fotos` : 'Quanto mais, melhor!'}`}
        />
      )}

      <div className="mt-4 p-3 rounded-xl bg-primary-light">
        <p className="text-xs text-primary-dark font-medium">
          💡 <strong>Dica:</strong> Use fotos variadas — diferentes ângulos, iluminações e expressões.
          Isso melhora drasticamente a consistência do rosto gerado.
        </p>
      </div>
    </Card>
  );
}
