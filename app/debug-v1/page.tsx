export const dynamic = 'force-dynamic';

export default function DebugPage() {
    return (
        <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
            <h1>Debug Page V1</h1>
            <p>Deployment is working if you see this.</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
}
