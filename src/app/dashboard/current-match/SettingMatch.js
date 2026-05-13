"use client";

import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Row, 
  Col, 
  ColorPicker, 
  Avatar, 
  Divider, 
  Typography, 
  message, 
  Spin,
  ConfigProvider,
  theme
} from "antd";
import { 
  SaveOutlined, 
  TeamOutlined, 
  ThunderboltOutlined,
  LoadingOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SettingMatch = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentData, setSelectedTournamentData] = useState(null);
  const [teamsData, setTeamsData] = useState([
    { name: "", tag: "", color: "#3b82f6", players: [] },
    { name: "", tag: "", color: "#ef4444", players: [] },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, tourRes] = await Promise.all([
          fetch("/api/current-game"),
          fetch("/api/tournaments")
        ]);
        const matchData = await matchRes.json();
        const tourData = await tourRes.json();
        
        setTournaments(tourData);

        if (matchData.success && matchData.data) {
          setTeamsData(matchData.data.teamsData);
          // Đảm bảo Form đã mount trước khi set dữ liệu
          form.setFieldsValue({
            tournamentName: matchData.data.tournamentName,
            matchType: matchData.data.matchType,
          });
        }
      } catch (error) {
        message.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [form]);

  const onFinish = async (values) => {
    const payload = { ...values, teamsData };
    try {
      const res = await fetch("/api/current-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) message.success("Cập nhật thành công!");
    } catch (err) {
      message.error("Lỗi kết nối");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#fff' }} spin />} />
    </div>
  );

  return (
    // ConfigProvider để ép toàn bộ antd sang Dark Mode
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#ffffff",
          colorBgBase: "#000000",
          colorTextBase: "#ffffff",
          borderRadius: 4,
        },
      }}
    >
      <div className="min-h-screen bg-black p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 border-l-4 border-white pl-4">
            <Title level={2} className="!text-white !m-0 uppercase tracking-widest">
              <ThunderboltOutlined className="mr-2" /> Match Control
            </Title>
            <Text className="text-gray-500">Thiết lập thông số trận đấu trực tiếp</Text>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[24, 24]}>
              {/* Box Thông tin chung */}
              <Col span={24}>
                <Card className="bg-zinc-900 border-zinc-800">
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Giải đấu" name="tournamentName">
                        <Input size="large" className="bg-black border-zinc-700" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Thể thức" name="matchType">
                        <Select size="large" options={[{value:'BO1'}, {value:'BO3'}, {value:'BO5'}]} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Cấu hình 2 Đội */}
              {[0, 1].map((idx) => (
                <Col xs={24} lg={12} key={`team-section-${idx}`}>
                  <Card 
                    title={<span className="text-white">TEAM {idx + 1}</span>}
                    className="bg-zinc-900 border-zinc-800"
                  >
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Tên đội" 
                          value={teamsData[idx].name}
                          onChange={(e) => {
                            const newTeams = [...teamsData];
                            newTeams[idx].name = e.target.value;
                            setTeamsData(newTeams);
                          }}
                        />
                        <ColorPicker 
                          value={teamsData[idx].color}
                          onChange={(c) => {
                            const newTeams = [...teamsData];
                            newTeams[idx].color = c.toHexString();
                            setTeamsData(newTeams);
                          }}
                        />
                      </div>

                      {/* Fix lỗi Divider orientation */}
                      <Divider titlePlacement="left" className="border-zinc-800">
                        <Text className="text-[10px] text-zinc-500 uppercase font-bold">Thành viên</Text>
                      </Divider>

                      <div className="space-y-2">
                        {teamsData[idx].players.map((p, pIdx) => (
                          <div key={p.id || `p-${idx}-${pIdx}`} className="flex items-center gap-3 p-2 bg-black rounded border border-zinc-800">
                            <Avatar src={p.avatar} size="small" />
                            <Text className="text-white text-xs">{p.nickname}</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}

              <Col span={24}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  icon={<SaveOutlined />}
                  className="bg-white text-black hover:!bg-gray-200 border-none font-bold h-12"
                >
                  LƯU CẤU HÌNH
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <style jsx global>{`
        .ant-card-head { border-bottom: 1px solid #27272a !important; }
        .ant-input, .ant-select-selector { border-color: #3f3f46 !important; }
        .ant-form-item-label label { color: #a1a1aa !important; }
      `}</style>
    </ConfigProvider>
  );
};

export default SettingMatch;