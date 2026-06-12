import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

// Phase 08: Hello-World — verifiziert Edge-Deploy-Pipeline. verify_jwt=true:
// nur eingeloggte Nutzer (Authorization: Bearer <access_token>) erreichen sie.
Deno.serve((req: Request) => {
  const auth = req.headers.get('Authorization') ?? '';
  return new Response(
    JSON.stringify({ message: 'Hello from Apex', authenticated: auth.startsWith('Bearer ') }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
