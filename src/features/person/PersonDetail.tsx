import { useParams } from "react-router-dom";

export default function PersonDetail() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2">Detalhe da Pessoa</h1>
      <p className="text-gray-600">ID: {id}</p>
      <button className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white">
        Tenho informações
      </button>
    </div>
  );
}
