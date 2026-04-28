import { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Table, Tag, Typography, Spin, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ApiOutlined, RobotOutlined } from '@ant-design/icons';
import { healthApi, tasksApi, type HealthData, type Task } from '../services/api';

const { Title, Text } = Typography;

const statusColor: Record<string, string> = {
  pending: 'orange',
  running: 'blue',
  completed: 'green',
  failed: 'red',
};

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '类型', dataIndex: 'type', key: 'type' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (s: string) => <Tag color={statusColor[s] ?? 'default'}>{s}</Tag>,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (t: string) => new Date(t).toLocaleString('zh-CN'),
  },
];

export default function Dashboard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [healthError, setHealthError] = useState('');
  const [tasksError, setTasksError] = useState('');
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    healthApi.check()
      .then((r) => setHealth(r.data.data))
      .catch((e: Error) => setHealthError(e.message))
      .finally(() => setLoadingHealth(false));

    tasksApi.list()
      .then((r) => setTasks(r.data.data))
      .catch((e: Error) => setTasksError(e.message))
      .finally(() => setLoadingTasks(false));
  }, []);

  return (
    <div>
      <Title level={2} style={{ marginBottom: 4 }}>LocalViralCast</Title>
      <Text type="secondary">版本 0.1.0 — 本地爆款口播视频智能体</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Spin spinning={loadingHealth}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ApiOutlined style={{ fontSize: 28, color: '#1677ff' }} />
                <div>
                  <Text type="secondary">后端连接</Text>
                  <div>
                    {healthError ? (
                      <Badge status="error" text={<Text type="danger">离线</Text>} />
                    ) : health ? (
                      <Badge status="success" text={<Text>在线 — {health.status}</Text>} />
                    ) : null}
                  </div>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card>
            <Spin spinning={loadingHealth}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <RobotOutlined style={{ fontSize: 28, color: '#722ed1' }} />
                <div>
                  <Text type="secondary">Ollama 连接</Text>
                  <div>
                    {healthError ? (
                      <Badge status="error" text={<Text type="danger">未知</Text>} />
                    ) : health ? (
                      health.ollama_connected ? (
                        <Badge status="success" text={<Text style={{ color: '#52c41a' }}><CheckCircleOutlined /> 已连接</Text>} />
                      ) : (
                        <Badge status="error" text={<Text type="danger"><CloseCircleOutlined /> 未连接</Text>} />
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      {healthError && (
        <Alert type="error" message={`后端连接失败: ${healthError}`} style={{ marginTop: 16 }} showIcon />
      )}

      <Card title="最近任务" style={{ marginTop: 24 }}>
        {tasksError ? (
          <Alert type="error" message={`加载任务失败: ${tasksError}`} showIcon />
        ) : (
          <Table
            dataSource={tasks}
            columns={columns}
            rowKey="id"
            loading={loadingTasks}
            pagination={{ pageSize: 10 }}
            size="small"
            locale={{ emptyText: '暂无任务' }}
          />
        )}
      </Card>
    </div>
  );
}
