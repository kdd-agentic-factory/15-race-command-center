import {chassisProductUrl} from '../lib/chassis-product-url';
const appUrl = chassisProductUrl('chassis');
export function ChassisGeometryPage() {
  return <section className="panel space-y-4"><h1 className="text-2xl font-semibold">Chassis Tool</h1><p>El espacio de trabajo de chasis se ha centralizado en la aplicación principal, con señales grabadas y dimensiones medidas. Esta pantalla ya no genera recomendaciones de demostración.</p><a className="text-kdd-accent" href={appUrl}>Abrir el espacio de trabajo de chasis</a></section>;
}
