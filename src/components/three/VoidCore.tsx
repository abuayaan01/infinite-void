export function VoidCore() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial color="#6ec6ff" transparent opacity={0.08} />
    </mesh>
  );
}
