import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import axios from 'axios';
// import { Link } from 'react-router';
import {
  fetchRepository,
  changeIconSize,
  // resetIconSize,
} from '../../actions/repository';
import { getIconDetail, editIconStyle } from '../../actions/icon';
// import SliderSize from '../../components/SliderSize/SliderSize';
import DownloadDialog from '../../components/DownloadDialog/DownloadDialog.jsx';
import Dialog from '../../components/common/Dialog/Index.jsx';
import Loading from '../../components/common/Loading/Loading.jsx';
import { SubTitle } from '../../components/';
import { autobind } from 'core-decorators';

import './Statistic.scss';
// import IconButton from '../../components/common/IconButton/IconButton.jsx';
import Icon from '../../components/common/Icon/Icon.jsx';

@connect(
  state => ({
    currRepository: state.repository.currRepository,
    userInfo: state.user.info,
  }),
  {
    fetchRepository,
    changeIconSize,
    // resetIconSize,
    getIconDetail,
    editIconStyle,
  }
)
export default class Statistic extends Component {

  static propTypes = {
    fetchRepository: PropTypes.func,
    changeIconSize: PropTypes.func,
    // resetIconSize: PropTypes.func,
    getIconDetail: PropTypes.func,
    editIconStyle: PropTypes.func,
    currRepository: PropTypes.object,
    userInfo: PropTypes.object,
    params: PropTypes.object,
    push: PropTypes.func,
  };

  state = {
    isShowDownloadDialog: false,
    isShowLoading: false,
  };

  componentDidMount() {
    this.fetchRepositoryWrapper();
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.params.id !== this.props.params.id) {
  //     this.fetchRepositoryWrapper(nextProps.params.id);
  //     this.refs.myslider.getWrappedInstance().reset();
  //   }
  // }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  @autobind
  getIconsDom() {
    return findDOMNode(this.refs.iconsContainer).getElementsByClassName('Icon');
  }

  @autobind
  handleScroll() {
    const scrollTop = document.body.scrollTop;
    const element = findDOMNode(this.refs.repo);
    if (scrollTop >= 64) {
      element.setAttribute('class', 'repository fixed');
    } else {
      element.setAttribute('class', 'repository');
    }
  }

  @autobind
  fetchRepositoryWrapper(currentId) {
    let { params: { id } } = this.props;
    if (currentId) id = currentId;
    id = 2;
    this.setState({
      isShowLoading: true,
    }, () => {
      // this.refs.myslider.getWrappedInstance().reset();
      this.props.fetchRepository(id)
        .then(() => this.setState({ isShowLoading: false }))
        .catch(() => this.setState({ isShowLoading: false }));
    });
  }

  @autobind
  changeSize(value) {
    this.props.changeIconSize(value);
  }

  @autobind
  clickIconDownloadBtn(iconId) {
    return () => {
      this.props.getIconDetail(iconId).then(() => {
        this.props.editIconStyle({ color: '#34475e', size: 255 });
        this.setState({
          isShowDownloadDialog: true,
        });
      });
    };
  }

  @autobind
  dialogUpdateShow(isShow) {
    const { params: { id } } = this.props;
    const { currentPage } = this.props.currRepository;
    this.setState({
      isShowDownloadDialog: isShow,
    });
    this.props.fetchRepository(id, currentPage);
  }

  @autobind
  downloadAllIcons() {
    const { id } = this.props.params;
    axios
      .post('/api/download/font', { type: 'repo', id })
      .then(({ data }) => {
        if (data.res) {
          const { foldName } = data.data;
          window.location.href = `/download/${foldName}`;
        }
      });
  }

  render() {
    const { icons } = this.props.currRepository;
    // const userInfo = this.props.userInfo;
    // const { id: repoId } = this.props.params;
    // 登录状态：1：未登录  2：普通用户登录  3：管理员登录
    // let status = 1;
    // if (userInfo.login) {
    //   status = 2;
    //   if (userInfo.admin || userInfo.repoAdmin.indexOf(repoId) !== -1) {
    //     status = 3;
    //   }
    // }
    return (
      <div className="repository" ref="repo">
        <SubTitle tit={'图标使用详情统计'}>
          <div className="sub-title-chil">
            <span className="count">
              <b className="num">6400</b>icons
            </span>
            <span className="powerby">已使用:</span>
            <span className="name">2300 icons</span>
            <div className="tool-content">
              <ul className="code-list">
                <li className="code-item">0</li>
                <li className="code-item">1</li>
                <li className="code-item">2</li>
                <li className="code-item">3</li>
                <li className="code-item">4</li>
                <li className="code-item">5</li>
                <li className="code-item">6</li>
                <li className="code-item">7</li>
                <li className="code-item">8</li>
                <li className="code-item">9</li>
                <li className="code-item">A</li>
                <li className="code-item">B</li>
                <li className="code-item">C</li>
                <li className="code-item">D</li>
                <li className="code-item">E</li>
                <li className="code-item">F</li>
              </ul>
              {/* <div className="tools">
                <Link to={`/upload/repository/${repoId}`} className="options-btns btns-blue">
                  <i className="iconfont">&#xf50a;</i>上传新图标
                </Link>
                <button
                  onClick={this.downloadAllIcons}
                  className="options-btns btns-blue"
                >
                  <i className="iconfont">&#xf50b;</i>下载全部图标
                </button>
                {status === 3 &&
                  <Link
                    to={`/repositories/${repoId}/logs`}
                    className="options-btns btns-default"
                  >
                    查看日志
                  </Link>
                }
              </div> */}
              {/* <SliderSize ref="myslider" getIconsDom={this.getIconsDom} /> */}
            </div>
          </div>
        </SubTitle>
        <div className="yicon-detail-main">
          <div className="yicon-detail-list clearfix" ref="iconsContainer">
            {
              icons.map((icon) => (
                // <IconButton
                //   icon={icon}
                //   key={icon.id}
                //   download={this.clickIconDownloadBtn(icon.id)}
                //   toolBtns={['copytip', 'copy', 'edit', 'download', 'cart']}
                // />
                <Icon
                  key={icon.id}
                  size={16}
                  fill={'#555f6e'}
                  d={icon.path}
                />
              ))
            }
          </div>
        </div>
        <Dialog
          empty
          visible={this.state.isShowDownloadDialog}
          getShow={this.dialogUpdateShow}
        >
          <DownloadDialog type="repo" />
        </Dialog>
        <Loading visible={this.state.isShowLoading} />
      </div>
    );
  }
}

Statistic.appPageTitle = '图标大库';