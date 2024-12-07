import Form from "./components/Form";
import FormHeader from "./components/FormHeader";

export default function App() {
  return (
    <main className="bg-sky-50 min-h-screen p-24">
    <div className="mx-auto container max-w-md px-10 py-6 border-slate-300 border-2 rounded-2xl">
        <FormHeader />
        <Form />
      </div>
    </main>
  )
}