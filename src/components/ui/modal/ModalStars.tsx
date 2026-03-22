import { useModalStars } from '@/lib/hooks/ui/useModalStars';

interface Props {
  starsCount?: number;
}

const ModalStars = ({ starsCount }: Props) => {
  const stars = useModalStars(starsCount);
  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}
    </>
  );
};

export default ModalStars;
