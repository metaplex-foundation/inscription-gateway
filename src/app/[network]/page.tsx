export default function Network({ params }: { params: { network: string } }) {
  return <h1>Using Cluster {params.network}</h1>
}
