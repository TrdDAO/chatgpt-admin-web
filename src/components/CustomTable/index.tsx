/**
 * 通用表格组件，适用于以下业务：
 * 顶部数据过滤（可配置）
 * 中间表格操作（可配置）
 * 底部分页（可配置）
 * API传入即可
 */
import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Table,
  message,
  notification,
} from "antd";
import React, { useEffect, useLayoutEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { debounce } from 'lodash';
import './index.less';

interface CustomTableProps {
	searchApi: Function,// 搜索函数
	searchConditions: {
		value:string, // 搜索条件键名
		label:string, // 搜索条件文本
		rules?:any[], // 验证规则
		component: React.ReactNode | (() => React.ReactNode), // 组件
		sort?: number, // 折叠时候优先级
	}[]; // 搜索条件项配置
	layoutNum?:number; // 搜索横向布局个数，默认根据屏幕宽度动态生成
	labelCol:{span?:number; offset?:number}; // 搜索项，文本占的宽度
	wrapperCol:{span?:number; offset?:number}; // 搜索项，内容占的宽度
	columns: any; // 列选项
	getDataApi: (option:any)=>Promise<any>;
	showRowSelection?: boolean | undefined; // 是否可勾选
	showPagination?: boolean | undefined; // 是否分页
	title?: React.ReactNode | null; // 标题渲染
}

const CustomTable: React.FC<CustomTableProps> = forwardRef((props, ref) => {
	// 初始化表格数据
	const formDataDefault = {

	}
	const formEle = useRef();
	// 提示框
  const [messageApi, msgContextHolder] = message.useMessage();
  // 通知栏
  const [notificationApi, notContextHolder] = notification.useNotification();
	// 搜索条件
	const [searchForm] = Form.useForm();
	// 搜索展开
	const [expand, setExpand] = useState<boolean>(false);
	// 是否展示展开
	const [showExpand, setShowExpand] = useState<boolean>(false);
	// 横向布局个数，默认4个
	const [layoutNum, setLayoutNum] = useState<number>(props.layoutNum||4);
	// 表单数据
  const [formData, setFormData] = useState(Object.assign({}, formDataDefault));
	// 当前页
  const [current, setCurrent] = useState<number>(1);
	// 总页
	const [total, setTotalt] = useState<number>(0);
	// 加载中
	const [tableLoading, setTableLoading] = useState<boolean>(false);
	// 分页个数，默认20
	const [pageSize, setPageSize] = useState<number>(20);
	// 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);
	// 勾选的表格数据
	const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  // 表格高度，初始化给一个160的空数据高度
  const [tableHeight, setTableHeight] = useState<number>(160);
	// 勾选表格出发批量操作
	const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
	// 表格分页
	const onPageChange = (current:number, pageSize:number) => {
    getTableData({current: current-1, pageSize: pageSize});
  }
	// 表格数据
  const getTableData = (newPageData:any) => {
		setTableLoading(true);
    props.getDataApi && props.getDataApi(newPageData ? newPageData : {
      current: current-1,
      size: pageSize,
    }).then((res:any) => {
      if(res.content && res.content.length) {
        setDataSource(
          res.content.map((item:any, index:number) => {
						if(!item.key){
							item.key = index;
						}
            return item;
          })
        );
				setCurrent(res.number+1);
				setPageSize(res.size);
				setTotalt(res.totalElements);
        // setPagination(Object.assign({}, pagination, {current: res.number+1, pageSize: res.size, total: res.totalElements, onChange: handlePageChange}));
      }
    }).catch(() => {
      setDataSource([]);
    }).finally(() => {
			setTableLoading(false);
		});
  };
	
	// 重置搜索
	const handleResetSearch = () => {

	}
	// 触发搜索
	const handleSearch = () => {

	}
	// 窗口大小变更，布局个数
	const setMediaType = debounce(() => {
		const clientWidth = document.documentElement.clientWidth;
		if(clientWidth>=1980){
			setLayoutNum(6);
		}else if(clientWidth>=1600) {
			setLayoutNum(4);
		} else if(clientWidth>=1200) {
			setLayoutNum(3);
		} else {
			setLayoutNum(2);
		}
	}, 100)
	// 勾选配置
	const rowSelection = props.showRowSelection ? {
    selectedRowKeys,
    onChange: onSelectChange,
  } : undefined;
	// 分页设置
	const paginationConfig = props.showPagination ?  {
		current,
		total,
		pageSize,
		showSizeChanger: true,
		onChange: onPageChange,
	} : undefined;

	// 给父组件暴露的方法
	useImperativeHandle(ref, () => ({
		// 重新初始化表格
		initTable: ()=>{
			getTableData(null);
		}
	}))

	useEffect(() => {
		getTableData(null);
		return () => {

		}
	}, [])

	useEffect(() => {
		const showExpand = props.searchConditions && props.searchConditions.length > layoutNum*3 ? true : false;
		setShowExpand(showExpand);
	}, [layoutNum])

	useLayoutEffect(() => {
		setLayoutHeight();
		setMediaType();
		window.addEventListener('resize', setMediaType)
		return () => {
			window.removeEventListener('resize', setMediaType)
		}
	}, [])

	const setLayoutHeight = () => {
		// TODO
		// 少了顶部搜索的高度，暂时用不到
		const container = document.querySelector('.layout-main-content');
    const height = container ? container.clientHeight - 20 - 56 - 56 - 47 : 160;
    setTableHeight(height);
	}
	// 搜索条件渲染
	const renderSearchFields = () => {
		const span = 24/layoutNum;
		// 搜索条件
		const list = showExpand ? props.searchConditions.sort((a, b) => (a.sort||0) - (b.sort||0)) : props.searchConditions;
		const children = list.map((item, index) => {
			return <Col span={span} key={index}>
				<Form.Item
					name={item.value}
					label={item.label}
					rules={item.rules}
				>
					{typeof item.component === 'function' ? item.component() : item.component}
				</Form.Item>
			</Col>
		})
		// 按钮位置
		const offset = (layoutNum - props.searchConditions.length%layoutNum - 1)*span;
		children.push(<Col span={span} offset={offset} key='last' style={{textAlign: 'right'}}>
			<Space>
				<Button onClick={handleResetSearch}>重置</Button>
				<Button type="primary" size="middle" onClick={handleSearch}>搜索</Button>
			</Space>
		</Col>)
		return children
	}
	// 搜索按钮渲染
	// const renderSearchButton = () => {
	// 	const span = 24/layoutNum;
	// 	const centerSpan = layoutNum-2 > 0 ? span*(layoutNum-2) : 0;
	// 	// 超过3行才显示展开按钮
	// 	const showExpand = props.searchConditions.length > layoutNum*3 ? true : false;
	// 	const children:any = [];
	// 	children.push(layoutNum === 2 ? <Col span={span} key='first'>
	// 		{showExpand ?<div className="toogle-expand" onClick={() => setExpand(!expand)}>{expand ? '收起' : '展开'}</div> : null}
	// 	</Col> : <Col span={centerSpan} offset={span} key='center'>
	// 		{showExpand ? <div className="toogle-expand" onClick={() => setExpand(!expand)}>{expand ? '收起' : '展开'}</div> : null}
	// 	</Col>);
	// 	children.push(<Col span={span}  key='last' style={{textAlign: 'right'}}>
	// 		<Space>
	// 			<Button onClick={handleResetSearch}>重置</Button>
	// 			<Button type="primary" size="middle" onClick={handleSearch}>搜索</Button>
	// 		</Space>
	// 	</Col>)
	// 	return children
	// }

	return (
		<>
			{/* 提示 */}
			{msgContextHolder}
			{/* 通知 */}
			{notContextHolder}
			{/* 顶部条件搜索 */}
			{
				props.searchConditions ? <Form
					className="custom-layout-form"
					form={searchForm}
					name="searchForm"
					labelCol={props.labelCol}
					labelWrap
					wrapperCol={props.wrapperCol}
				>
					<Row gutter={24}>{renderSearchFields()}</Row>
					{/* <Row gutter={24}>
						{}
						{renderSearchButton()}
					</Row> */}
					{showExpand ? <div className="toogle-expand" onClick={() => setExpand(!expand)}>{expand ? '收起' : '展开'}</div> : null}
				</Form> : null
			}
			{/* 表格主体 */}
			<Table
				// 支持默认参数
				{...props as any}
				dataSource={dataSource}
        pagination={paginationConfig}
        rowSelection={rowSelection}
        scroll={{ y: tableHeight }}
        size="middle"
				loading={tableLoading}
      />
		</>
	)
})

export default CustomTable;