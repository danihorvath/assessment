import { useState } from "react";
import "./App.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";

const blogPostSchema = Yup.object({
  title: Yup.string()
    .min(2, "Too Short!")
    .required("Please enter a title for your blog post."),
  body: Yup.string()
    .min(2, "Too Short!")
    .required("Please enter a content for your blog post."),
});

function App() {
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = (values: { title: string; body: string }) => {
    const handleError = () => {
      setLoading(false);
      setError(true);
    };

    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/posts1", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.id) return handleError();
        setLoading(false);
        setPage(0);
        setSuccess(true);
      })
      .catch(() => {
        handleError();
      });
  };

  if (loading) return <Loading>Loading...</Loading>;
  return (
    <>
      {success && <Message variant="success">Success.</Message>}
      {error && <Message variant="error">Error.</Message>}
      <Formik
        initialValues={{ title: "", body: "" }}
        onSubmit={handleSubmit}
        validationSchema={blogPostSchema}
        validateOnMount
      >
        {({ isValid, errors }) => {
          return (
            <Form>
              <FormContainer>
                {page === 0 && (
                  <>
                    <Field name="title" placeholder="Title" />
                    <ErrorMessage
                      name="title"
                      render={(msg) => <Message variant="error">{msg}</Message>}
                    />
                    <Buttons>
                      <button
                        onClick={async () => {
                          if (!errors.title) setPage(1);
                        }}
                      >
                        Next
                      </button>
                    </Buttons>
                  </>
                )}
                {page === 1 && (
                  <>
                    <Field
                      name="body"
                      placeholder="Blog post body"
                      as="textarea"
                      rows={10}
                    />
                    <ErrorMessage
                      name="body"
                      render={(msg) => <Message variant="error">{msg}</Message>}
                    />
                    <Buttons>
                      <button
                        onClick={async () => {
                          setPage(0);
                        }}
                      >
                        Previous
                      </button>
                      <button type="submit" disabled={!isValid}>
                        Submit
                      </button>
                    </Buttons>
                  </>
                )}
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

const Message = styled.div<{ variant: string }>`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  color: "#fff";
  background-color: ${({ variant }) =>
    variant === "success" ? "#0080005b" : "#ff00006f"};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 50px;
  gap: 10px;
`;

const Loading = styled.div``;

export default App;
