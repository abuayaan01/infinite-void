import { useFrame, useThree } from "@react-three/fiber";

export function CameraRig() {
  const { camera, mouse } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const breatheX = Math.cos(t * 0.2) * 0.2;
    const breatheY = Math.sin(t * 0.3) * 0.3;

    camera.position.x += (mouse.x * 2 + breatheX - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 1.5 + breatheY - camera.position.y) * 0.03;

    camera.lookAt(0, 0, 0);
  });

  return null;
}
