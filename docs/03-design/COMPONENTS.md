# Componentes — BuscaVivaMT

Este documento cataloga os principais componentes da aplicação, com ênfase nos usados no fluxo de reporte de avistamento.

---

## 🧩 ReportForm

### Descrição
Formulário que permite ao cidadão enviar informações sobre um possível avistamento de uma pessoa desaparecida.

### Props (valores esperados)
```ts
type ReportFormValues = {
  informacao: string;
  descricao: string;
  data: string;    // formato yyyy-MM-dd
  ocoId: number;
  files: File[];
};
```

### Comportamento
Valida campos com **Zod**:  
- **informacao**: obrigatório, mínimo 10 caracteres  
- **descricao**: obrigatório, mínimo 3 caracteres  
- **data**: obrigatório, formato `yyyy-MM-dd`  
- **ocoId**: obrigatório  
- **files**: opcional, até 3 imagens válidas  

Monta payload para `POST /v1/ocorrencias/informacoes-desaparecido`:  
- **Query params**: informacao, descricao, data, ocoId  
- **Body multipart**: files[]  

### Exemplo
```tsx
import { useForm } from 'react-hook-form';
import { useCreateInfoOcorrencia } from '@/hooks/useOccurrence';
import { PhotoUploader } from '@/components/PhotoUploader';

function ReportForm({ ocoId }: { ocoId: number }) {
  const { register, handleSubmit, setValue } = useForm<ReportFormValues>();
  const { mutate, isLoading } = useCreateInfoOcorrencia();

  const onSubmit = (values: ReportFormValues) => mutate({ ...values, ocoId });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register('informacao')} placeholder="Descreva o avistamento" />
      <input {...register('descricao')} placeholder="Descrição do anexo" />
      <input type="date" {...register('data')} />
      <PhotoUploader onChange={(files) => setValue('files', files)} />
      <button type="submit" disabled={isLoading}>Enviar</button>
    </form>
  );
}
```

---

## 🖼️ PhotoUploader

### Descrição
Componente para anexar fotos no reporte.

### Regras
- Tipos aceitos: `image/jpeg`, `image/png`, `image/webp`  
- Tamanho máximo: **5MB** por arquivo  
- Quantidade máxima: **3 fotos**  
- Exibir previews  
- Permitir remover/reinserir arquivos  
- Mostrar mensagens de erro claras em caso de tipo/tamanho inválido  

### Exemplo
```tsx
function PhotoUploader({ onChange }: { onChange: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);

  const validate = (f: File) => {
    const okType = ['image/jpeg','image/png','image/webp'].includes(f.type);
    const okSize = f.size <= 5 * 1024 * 1024;
    return okType && okSize;
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter(validate).slice(0, 3 - files.length);
    const next = [...files, ...valid].slice(0, 3);
    setFiles(next);
    onChange(next);
  };

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onChange(next);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleSelect}
      />
      <ul>
        {files.map((f, i) => (
          <li key={i}>
            <img src={URL.createObjectURL(f)} alt={`foto-${i}`} />
            <button type="button" onClick={() => removeAt(i)}>Remover</button>
          </li>
        ))}
      </ul>
      <p>Até 3 fotos (JPG/PNG/WebP), máx. 5MB cada.</p>
    </div>
  );
}
```

---

## 📌 Outros Componentes Relevantes
- **PersonCard**: exibe foto, nome, idade, status (DESAPARECIDO/LOCALIZADO).  
- **Pagination**: controles de navegação de página (mostrando 10 por página).  
- **SearchBar**: campo de busca com debounce (300ms).  
- **FilterPanel**: filtros (status, cidade, idade, data).  
- **EmptyState**: feedback de lista vazia.  
- **StatusPill**: pill colorida para status da pessoa.  
- **Loading/Spinner**: feedback visual de carregamento.  
- **Modal**: para abertura do ReportForm em overlay.  
