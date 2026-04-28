import { useState } from 'react';
import { Card, Input, Button, Typography, Alert, Upload, Row, Col, Divider, Space } from 'antd';
import { UploadOutlined, SendOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { llmApi, mediaApi } from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function Lab() {
  const [prompt, setPrompt] = useState('');
  const [llmResult, setLlmResult] = useState('');
  const [llmError, setLlmError] = useState('');
  const [llmLoading, setLlmLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [renderResult, setRenderResult] = useState<{ output_path: string; duration: number } | null>(null);
  const [renderError, setRenderError] = useState('');
  const [renderLoading, setRenderLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLlmLoading(true);
    setLlmResult('');
    setLlmError('');
    try {
      const res = await llmApi.generate(prompt);
      setLlmResult(res.data.data?.text ?? '');
    } catch (e: unknown) {
      setLlmError(e instanceof Error ? e.message : '生成失败');
    } finally {
      setLlmLoading(false);
    }
  };

  const handleRender = async () => {
    if (!imageFile || !audioFile) return;
    setRenderLoading(true);
    setRenderResult(null);
    setRenderError('');
    try {
      const res = await mediaApi.simpleRender(imageFile, audioFile);
      setRenderResult(res.data.data);
    } catch (e: unknown) {
      setRenderError(e instanceof Error ? e.message : '合成失败');
    } finally {
      setRenderLoading(false);
    }
  };

  const beforeImageUpload = (file: UploadFile) => {
    setImageFile(file as unknown as File);
    return false;
  };

  const beforeAudioUpload = (file: UploadFile) => {
    setAudioFile(file as unknown as File);
    return false;
  };

  return (
    <div>
      <Title level={2}>实验室</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="LLM 文案生成" style={{ height: '100%' }}>
            <TextArea
              rows={4}
              placeholder="输入 Prompt，例如：请写一段 15 秒的口播脚本，主题是健身减脂..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onPressEnter={(e) => { if (e.ctrlKey) handleGenerate(); }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Ctrl+Enter 快速生成</Text>
            <div style={{ marginTop: 12 }}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={llmLoading}
                onClick={handleGenerate}
                disabled={!prompt.trim()}
              >
                生成文案
              </Button>
            </div>

            {llmError && <Alert type="error" message={llmError} style={{ marginTop: 16 }} showIcon />}

            {llmResult && (
              <div style={{ marginTop: 16 }}>
                <Divider orientation="left">生成结果</Divider>
                <Paragraph
                  style={{
                    background: '#f5f5f5',
                    padding: 12,
                    borderRadius: 6,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 300,
                    overflowY: 'auto',
                  }}
                  copyable
                >
                  {llmResult}
                </Paragraph>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="视频合成（图片 + 音频 → MP4）" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>上传封面图片</Text>
                <div style={{ marginTop: 8 }}>
                  <Upload
                    accept="image/*"
                    maxCount={1}
                    beforeUpload={beforeImageUpload}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>选择图片</Button>
                  </Upload>
                </div>
              </div>

              <div>
                <Text strong>上传音频文件</Text>
                <div style={{ marginTop: 8 }}>
                  <Upload
                    accept="audio/*"
                    maxCount={1}
                    beforeUpload={beforeAudioUpload}
                  >
                    <Button icon={<UploadOutlined />}>选择音频</Button>
                  </Upload>
                </div>
              </div>

              <Button
                type="primary"
                icon={<VideoCameraOutlined />}
                loading={renderLoading}
                onClick={handleRender}
                disabled={!imageFile || !audioFile}
                block
              >
                开始合成
              </Button>
            </Space>

            {renderError && (
              <Alert type="error" message={renderError} style={{ marginTop: 16 }} showIcon />
            )}

            {renderResult && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  type="success"
                  message="合成成功"
                  description={
                    <Space direction="vertical">
                      <Text>输出路径：<Text code copyable>{renderResult.output_path}</Text></Text>
                      <Text>时长：{renderResult.duration.toFixed(1)} 秒</Text>
                    </Space>
                  }
                  showIcon
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
