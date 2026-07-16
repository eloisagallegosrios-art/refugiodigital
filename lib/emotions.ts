export interface EmotionDef {
  id:          string
  label:       string
  description: string
}

export const EMOTIONS: EmotionDef[] = [
  { id: 'miedo',    label: 'Tengo miedo',       description: 'Algo te asusta o genera incertidumbre' },
  { id: 'ansiedad', label: 'Estoy ansioso',      description: 'Tu mente no para y el cuerpo lo siente' },
  { id: 'soledad',  label: 'Me siento solo',     description: 'Sientes que nadie te acompaña ahora' },
  { id: 'enojo',    label: 'Estoy enojado',      description: 'Algo dentro de ti quiere ser escuchado' },
  { id: 'perdon',   label: 'Necesito perdonar',  description: 'Cargas un peso que no es tuyo' },
  { id: 'sin-paz',  label: 'Perdí la paz',       description: 'Algo te sacó de tu centro' },
]
