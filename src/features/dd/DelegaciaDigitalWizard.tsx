import { useState } from 'react'
import { useDelegaciaDigital } from '@/hooks/useDelegaciaDigital'
import toast from 'react-hot-toast'

export default function DelegaciaDigitalWizard() {
  const { verificar, criar } = useDelegaciaDigital()
  const [step, setStep] = useState<0|1|2|3|4|5|6>(0)
  const [payload, setPayload] = useState<any>({})

  // Step 0 - Verificar duplicidade
  const onCheck = async (basic: { nome: string; mae?: string; cpf?: string; dataNascimento?: string; dataDesaparecimento?: string }) => {
    try {
      const r = await verificar.mutateAsync(basic)
      setPayload((p: any) => ({ ...p, ...basic }))
      if (r?.duplicado) {
        toast.error('Já existe ocorrência semelhante. Verifique o protocolo.')
        return
      }
      setStep(1)
    } catch { toast.error('Falha ao verificar duplicidade') }
  }

  // Steps 1..5 - Coletar dados (vitima, sinais, contatos, fotos, endereço/unidade)
  // (Implemente com RHF + Zod em subcomponentes — mantemos curto aqui)

  const onSubmitFinal = async () => {
    try {
      const r = await criar.mutateAsync(payload)
      toast.success(`Ocorrência registrada. Protocolo: ${r.protocolo}`)
      setStep(0); setPayload({})
    } catch { toast.error('Falha ao criar ocorrência') }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Delegacia Digital</h2>
      {step === 0 && (
        <form className="space-y-2" onSubmit={(e) => {e.preventDefault(); onCheck(Object.fromEntries(new FormData(e.currentTarget as any)) as any)}}>
          {/* Campos básicos: nome, mãe, cpf, datas… */}
          <input name="nome" className="border px-3 py-2 w-full" placeholder="Nome completo" required />
          <input name="mae" className="border px-3 py-2 w-full" placeholder="Nome da mãe" />
          <input name="cpf" className="border px-3 py-2 w-full" placeholder="CPF (apenas números)" />
          <input name="dataNascimento" className="border px-3 py-2 w-full" placeholder="1990-05-15" />
          <input name="dataDesaparecimento" className="border px-3 py-2 w-full" placeholder="2025-03-18" />
          <div className="flex justify-end">
            <button className="px-3 py-2 rounded bg-blue-600 text-white">Continuar</button>
          </div>
        </form>
      )}

      {step > 0 && (
        <div className="p-3 border rounded">
          {/* Stub dos próximos passos; você pluga subformulários tipados e adiciona masks */}
          <p className="text-sm text-gray-600">Próximos passos do wizard (dados completos)…</p>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep((s) => (s > 0 ? (s - 1) as any : s))} className="px-3 py-2 rounded border">Voltar</button>
            <button onClick={onSubmitFinal} className="px-3 py-2 rounded bg-green-600 text-white">Enviar ocorrência</button>
          </div>
        </div>
      )}
    </div>
  )
}
