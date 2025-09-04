import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportFormSchema } from './reportFormSchema'
import { DateInput, PhoneInput } from '@/components/ui/InputMasks'

type FormValues = z.infer<typeof reportFormSchema>

export function ReportForm({ ocoId, onClose }: { ocoId: number; onClose: () => void }) {
  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      data: '',
      informacao: '',
      descricao: '',
      telefone: ''
    }
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPreviewFiles(Array.from(e.target.files || []))
  }

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      ocoId,
      telefone: data.telefone?.replace(/\D/g, '')
    }
    // TODO: chamada ao service (adapte para createInfoOcorrencia)
    // await createInfoOcorrencia(payload)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="data" className="block">Data do avistamento *</label>
        <Controller
          name="data"
          control={control}
          render={({ field }) => (
            <DateInput {...field} error={errors.data?.message} />
          )}
        />
        {errors.data && <span id="data-erro" className="text-xs text-red-600">{errors.data.message}</span>}
      </div>

      <div>
        <label htmlFor="informacao" className="block">O que foi visto? *</label>
        <textarea
          id="informacao"
          {...register('informacao')}
          aria-invalid={!!errors.informacao}
          aria-describedby={errors.informacao ? "informacao-erro" : undefined}
          className={`border rounded px-3 py-2 w-full ${errors.informacao ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.informacao && <span id="informacao-erro" className="text-xs text-red-600">{errors.informacao.message}</span>}
      </div>

      <div>
        <label htmlFor="telefone" className="block">Telefone (opcional)</label>
        <Controller
          name="telefone"
          control={control}
          render={({ field }) => (
            <PhoneInput {...field} error={errors.telefone?.message} />
          )}
        />
        {errors.telefone && <span id="telefone-erro" className="text-xs text-red-600">{errors.telefone.message}</span>}
      </div>

      <div>
        <label className="block">Fotos (até 3, máx. 5MB cada)</label>
        <input
          id="files"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded px-3 py-2 w-full"
        />
        {errors.files && <span className="text-xs text-red-600">{errors.files.message as string}</span>}
        {previewFiles.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {previewFiles.map((file, idx) => (
              <li key={idx} className="text-xs">{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Enviar Informação
        </button>
      </div>
    </form>
  )
}
