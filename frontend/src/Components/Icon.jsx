export default function Icon({ name, size = 20 }) {
  return <img className="icon" src={'/icons/' + name + '.svg'} width={size} height={size} alt="" />
}
