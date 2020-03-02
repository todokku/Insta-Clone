import React, { useCallback, useRef } from 'react';
import { CircularProgress, IconButton } from '@material-ui/core';
import { AddBoxOutlined } from '@material-ui/icons';
import styled from 'styled-components';
import { PostItem } from '../components/PostItem';
import { Uploader } from '../components/Uploader';
import { useNotifyNewPostsSubscription, useUploadFileMutation } from '../types/graphql';
import logo from '../assets/images/logo.png';

const Page = styled.div`
  padding-top: 45px;
  display: flex;
  justify-content: center;
`;

const Header = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #dbdbdb;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 12px;
`;

const Logo = styled.img`
  width: 100px;
  margin: auto;
`;

const CircularProgressWrapper = styled.div`
  padding: 8px 0;
`;

const List = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Footer = styled.footer`
  background: #ffffff;
  border-top: 1px solid #dbdbdb;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 1000;
  padding: 8px;
`;

const AddButtonWrapper = styled.div`
  margin: auto;
`;

export const PostsIndex = () => {
  const { loading: notifyNewPostsLoading, data: notifyNewPostsData } = useNotifyNewPostsSubscription();
  const [uploadFile, { loading: uploadFileLoading, data: uploadFileData }] = useUploadFileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClickAddButton = useCallback(() => fileInputRef.current?.click(), []);
  const handleUploadFile = useCallback((file: File) => uploadFile({ variables: { file } }), [uploadFile]);

  return (
    <Page>
      <Header>
        <Logo src={logo} alt="logo" />
      </Header>
      {notifyNewPostsLoading || uploadFileLoading ? (
        <CircularProgressWrapper>
          <CircularProgress size={30} />
        </CircularProgressWrapper>
      ) : (
        <List>
          {notifyNewPostsData?.Post.map(({ uuid, caption, image, User }) => (
            <li key={uuid}>
              <PostItem image={uploadFileData?.uploadFile ?? image} caption={caption} user={User} />
            </li>
          )) || null}
        </List>
      )}
      <Footer>
        <AddButtonWrapper>
          <Uploader ref={fileInputRef} onUpload={handleUploadFile}>
            <IconButton size="small" onClick={handleClickAddButton}>
              <AddBoxOutlined />
            </IconButton>
          </Uploader>
        </AddButtonWrapper>
      </Footer>
    </Page>
  );
};
