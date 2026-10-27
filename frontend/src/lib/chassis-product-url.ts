export function chassisProductUrl(section:'chassis'|'sessions'):string {
  const url=new URL(import.meta.env.VITE_CHASSIS_APP_URL??'http://127.0.0.1:5173/pit-wall/app',window.location.origin);
  if(section==='sessions')url.searchParams.set('workspace','recorded-sessions');
  return url.toString();
}
