import { forwardRef } from "react";

import type { FormProps } from "./types";

const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => (
  <form ref={ref} {...props} />
));

Form.displayName = "Form";

export default Form;
