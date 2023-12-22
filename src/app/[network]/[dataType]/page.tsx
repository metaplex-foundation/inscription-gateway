export default function Network({ params }: { params: { network: string, dataType: string } }) {
  return <h1>Using Data Type {params.dataType} on Cluster {params.network}</h1>
}
