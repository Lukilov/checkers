// Logo, or the first letter of the company when there is none.
export default function ShopLogo({ s, size = 48 }) {
  return s.logo ? (
    <img src={`/logo/${s.id}`} alt="" width={size} height={size} className="logo-img" />
  ) : (
    <span className="logo-img logo-letter" style={{ width: size, height: size, fontSize: size / 2.2 }}>
      {s.company[0].toUpperCase()}
    </span>
  )
}
