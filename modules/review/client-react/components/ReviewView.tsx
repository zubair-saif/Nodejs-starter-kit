import React, { useState } from 'react';
import { TranslateFunction } from '@gqlapp/i18n-client-react';
import { Row, Col, Checkbox, Spin, Tooltip } from 'antd';
import SuggestedListComponent from '@gqlapp/look-client-react/ui-antd/components/SuggestedListComponent';
import { MetaTags } from '@gqlapp/look-client-react';
import { Reviews, Review } from '../containers/Reviews.web';
import ReviewModal from './ReviewModal';
import ReviewsItemComponent from './ReviewsItemComponent';
import AvgRatingComponent from './AvgRatingComponent';

interface ReviewViewProps {
  t: TranslateFunction;
  filter: {
    modalName: string;
    modalId: number;
  };
  reviews: Reviews;
  loading: boolean;
  showAdd: boolean;
  currentUser: object;
  ratingAverage: {
    id: number;
    one: string;
    two: string;
    three: string;
    four: string;
    five: string;
  };
  addReview: () => null;
  deleteReview: (id: number) => null;
  handleHelpful: (id: number, value: number) => Promise<void>;
}

export const NoReviews: React.FC = () => (
  <div align="center">
    <br />
    Not Reviews
  </div>
);

const ReviewView: React.FC<ReviewViewProps> = props => {
  const {
    reviews,
    filter,
    loading,
    ratingAverage,
    handleHelpful,
    addReview,
    deleteReview,
    t,
    showAdd,
    currentUser
  } = props;
  const [photo, setPhoto] = useState(false);
  const renderFunc = (key: number, review: Review) => (
    <ReviewsItemComponent
      key={key}
      review={review}
      showPhotos={photo}
      handleHelpful={handleHelpful}
      deleteReview={deleteReview}
      currentUser={currentUser}
    />
  );

  const RenderReviews = () => (
    <div>
      <SuggestedListComponent
        grid={{
          gutter: 24,
          sm: 1,
          md: 1,
          lg: 1
        }}
        items={reviews}
        {...props}
        renderFunc={renderFunc}
      />
    </div>
  );
  return (
    <>
      <MetaTags title={t('title')} description={t('meta')} />
      <Row>
        <Col span={8}>
          <div align="center">
            <h1>{'Rating'}</h1>
            <h1>{' & '}</h1>
            <h1>{'Reviews'}</h1>
          </div>
        </Col>
        <Col span={4}>
          <br />
          <div align="center">
            {showAdd && (
              <>
                <ReviewModal
                  cardTitle={'Add Review'}
                  t={t}
                  addReview={addReview}
                  modalName={filter.modalName}
                  modalId={filter.modalId}
                />
                <br />
              </>
            )}
            <br />
            <Tooltip title={`review_image table dosn't exist`}>
              <Checkbox onChange={() => setPhoto(!photo)}>
                <strong>With photo</strong>
              </Checkbox>
            </Tooltip>
          </div>
        </Col>
        <Col span={12}>
          {ratingAverage && (
            <>
              <AvgRatingComponent rating={ratingAverage} />
            </>
          )}
        </Col>
        <Col span={24}>
          <br />
          <Col span={12}>
            <h3>
              <strong>{`${(reviews && reviews.totalCount) || 0} reviews`}</strong>
            </h3>
          </Col>
        </Col>
        <Col span={24}>
          {loading && (
            <div align="center">
              <br />
              <br />
              <br />
              <Spin text="Loading" />
            </div>
          )}
        </Col>
        <Col span={24}>{reviews && reviews.totalCount ? <RenderReviews /> : <NoReviews />}</Col>
      </Row>
    </>
  );
};

export default ReviewView;
