import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useInformacoesOcorrencia } from '@/hooks/useInformacoesOcorrencia'

const schema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato yyyy-MM-dd'),
  informacao: z.string().min(5, 'Descreva o que foi visto'),
  descricao: z.string().min(3, 'Descreva os anexos enviados'),
  files: z
    .any()
    .refine((files) => !files || files.length <= 3, 'Máx. 3 anexos')
    .refine((files) => !files || [...files].every((f: File) => f.size <= 5_000_000), 'Cada arquivo até 5MB'),
})

type FormValues = z.infer<typeof schema>

export function ReportForm({ ocoId, onClose }: { ocoId: number; onClose: () => void }) {
  const { create } = useInformacoesOcorrencia(ocoId)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const onOpen = (e: any) => { if (e.detail?.ocoId === ocoId) reset() }
    window.addEventListener('open-report-form', onOpen)
    return () => window.removeEventListener('open-report-form', onOpen)
  }, [ocoId, reset])

  const onSubmit = async (v: FormValues) => {
    try {
      await create.mutateAsync({
        ocoId,
        data: v.data,
        informacao: v.informacao,
        descricao: v.descricao,
        files: (v as any).files ? Array.from((v as any).files) : [],
      })
      toast.success('Informação enviada. Obrigado!')
      onClose()
    } catch (e: any) {
      toast.error('Falha ao enviar. Tente novamente.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-4 space-y-3">
        <h3 className="text-lg font-semibold">Tenho informações</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Data (yyyy-MM-dd)</label>
            <input className="border rounded px-3 py-2 w-full" placeholder="2025-03-18" {...register('data')} />
            <p className="text-xs text-red-600">{errors.data?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Informação avistada</label>
            <textarea className="border rounded px-3 py-2 w-full" rows={3} {...register('informacao')} />
            <p className="text-xs text-red-600">{errors.informacao?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Descrição dos anexos</label>
            <input className="border rounded px-3 py-2 w-full" placeholder="Ex.: fotos do local" {...register('descricao')} />
            <p className="text-xs text-red-600">{errors.descricao?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Fotos (até 3)</label>
            <input type="file" multiple accept="image/*" {...register('files')} />
            <p className="text-xs text-red-600">{errors.files?.message as any}</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancelar</button>
            <button disabled={isSubmitting} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
