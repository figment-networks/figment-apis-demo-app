import BroadcastTx from '../../components/BroadcastTx'

export default function() {
  return (
    <BroadcastTx route="near-delegate" operation="staking" description="Delegation" />
  )
}