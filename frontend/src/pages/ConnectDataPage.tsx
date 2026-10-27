import {chassisProductUrl} from '../lib/chassis-product-url';
const appUrl = chassisProductUrl('sessions');
export function ConnectDataPage() {
  return <section className="panel space-y-4"><h1 className="text-2xl font-semibold">Importación de telemetría</h1><p>La importación validada de AiM y 2D está centralizada en Chassis Tool. Esta interfaz no conecta dispositivos ni simula sesiones importadas.</p><a className="text-kdd-accent" href={appUrl}>Abrir Chassis Tool e importar una sesión</a></section>;
}
