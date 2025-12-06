"use client";

import { Container, Button, Card } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Welcome to GMVMax</h1>
        <p className="lead">
          Next.js app with React Bootstrap and Firebase
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Next.js</Card.Title>
              <Card.Text>
                React framework for production with server-side rendering and static site generation.
              </Card.Text>
              <Button variant="primary" href="https://nextjs.org" target="_blank">
                Learn More
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>React Bootstrap</Card.Title>
              <Card.Text>
                Bootstrap components built with React for a modern, responsive UI.
              </Card.Text>
              <Button variant="success" href="https://react-bootstrap.github.io" target="_blank">
                Learn More
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <Card.Body>
              <Card.Title>Firebase</Card.Title>
              <Card.Text>
                Firebase is configured and ready to use. Import from @/lib/firebase
              </Card.Text>
              <Button variant="warning" href="https://firebase.google.com" target="_blank">
                Learn More
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}
