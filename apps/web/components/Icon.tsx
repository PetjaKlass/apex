export function Icon({ id, s = 17 }: { id: string; s?: number }) {
  return (
    <svg width={s} height={s} aria-hidden="true">
      <use href={`/sprite.svg#${id}`} />
    </svg>
  );
}
