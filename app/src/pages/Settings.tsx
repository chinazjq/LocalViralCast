import { useState } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Divider, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { llmApi } from '../services/api';

const { Title, Text } = Typography;

interface TestResult {
  success: boolean;
  message: string;
  elapsed: number;
}

export default function Settings() {
  const [form] = Form.useForm();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    const start = Date.now();
    try {
      const res = await llmApi.test();
      setResult({
        success: res.data.success,
        message: res.data.data?.message ?? '连接成功',
        elapsed: Date.now() - start,
      });
    } catch (e: unknown) {
      setResult({
        success: false,
        message: e instanceof Error ? e.message : '连接失败',
        elapsed: Date.now() - start,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <Title level={2}>设置</Title>

      <Card title="Ollama 配置" style={{ maxWidth: 560 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ base_url: 'http://localhost:11434', model: 'qwen2.5:7b-instruct' }}
        >
          <Form.Item label="Ollama 地址" name="base_url">
            <Input placeholder="http://localhost:11434" />
          </Form.Item>
          <Form.Item label="默认模型" name="model">
            <Input placeholder="qwen2.5:7b-instruct" />
          </Form.Item>

          <Divider />

          <Space>
            <Button
              type="primary"
              onClick={handleTest}
              loading={testing}
              icon={testing ? <LoadingOutlined /> : undefined}
            >
              测试连接
            </Button>
          </Space>
        </Form>

        {result && (
          <div style={{ marginTop: 16 }}>
            <Alert
              type={result.success ? 'success' : 'error'}
              icon={result.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              message={
                <Space>
                  <Text>{result.message}</Text>
                  <Text type="secondary">({result.elapsed} ms)</Text>
                </Space>
              }
              showIcon
            />
          </div>
        )}
      </Card>
    </div>
  );
}
