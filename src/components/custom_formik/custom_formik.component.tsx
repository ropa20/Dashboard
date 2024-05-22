import { Form, Formik } from 'formik';
import React from 'react';

const CustomFormik = (props: any) => {
  const { children } = props;
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>{children}</Form>
    </Formik>
  );
};

export default CustomFormik;
