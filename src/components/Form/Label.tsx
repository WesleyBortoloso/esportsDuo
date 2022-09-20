import { LabelProps } from "../../model/LabelProps";


export function Label(props: LabelProps) {
  return (
    <label
      {...props}
      className="font-semibold"
    > {props.content} </label>
  )
}