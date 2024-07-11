import { FC } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import { Outlet } from 'react-router-dom';

import { usePageTags } from '@/hooks';
import { siteInfoStore } from '@/stores';

const Home: FC = () => {
  const { siteInfo } = siteInfoStore();
  usePageTags({ title: siteInfo.name, subtitle: siteInfo.short_description });

  return (
    <Container className="d-flex flex-column flex-fill">
      <Row className="flex-fill">
        <Col xl={10} lg={9} md={12}>
          哈哈哈
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
