import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { CSVLink } from "react-csv";

import {
  uploadCSVAction,
  removeCourseOfUploadedAction,
  setUpdateModalPageStatusAction,
  saveBulkCourseRequestAction
} from "../../../ducks";

import { Icon } from "antd";
import {
  StyledModal,
  StyledUploadBtn,
  StyledUploadCSVDiv,
  SuccessIcon,
  AlertIcon,
  ConfirmP,
  SuccessP,
  AlertP,
  UploadedContent,
  StyledSpin,
  StyledTable,
  StyledTableButton,
  StyledConfirmButton,
  AlertSuccess,
  StyledAlert,
  StatusDiv
} from "./styled";

class UploadCourseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      alertMsgStr: ""
    };

    this.columns = [];
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      dataSource: nextProps.uploadedCSVData
    };
  }

  handleDeleteCourse = key => {
    this.props.removeSelectedCourse(key);
  };

  onCloseModal = () => {
    this.props.closeModal();
  };

  onUploadCSV = () => {
    this.inputElement.click();
  };

  handleCSVChange = event => {
    const file = event.target.files[0];
    const { uploadCSVCourse, setPageStatus } = this.props;

    var fileReader = new FileReader();
    const scope = this;

    fileReader.onload = function(fileLoadedEvent) {
      var textFromFileLoaded = fileLoadedEvent.target.result;
      var lineArr = textFromFileLoaded.split("\n");
      var headerArr = lineArr[0].split(",");
      if (headerArr.length == 2) {
        if (headerArr[0] === "course_id" && headerArr[1] === "course_name") {
          uploadCSVCourse(file);
        } else {
          setPageStatus("upload-novalidate-csv");
          scope.setState({ alertMsgStr: "Unsupported file format" });
        }
      } else {
        setPageStatus("upload-novalidate-csv");
        scope.setState({ alertMsgStr: "Unsupported file format" });
      }
    };

    fileReader.readAsBinaryString(file, "UTF-8");
  };

  uploadCourse = () => {
    let uploadBulkCourseData = [];
    for (let i = 0; i < this.state.dataSource.length; i++) {
      uploadBulkCourseData.push({
        number: this.state.dataSource[i].courseNo,
        name: this.state.dataSource[i].courseName
      });
    }
    const { uploadBulkCourse, searchData } = this.props;
    uploadBulkCourse({ uploadBulkCourseData, searchData });
  };

  goBackUpload = () => {
    this.props.setPageStatus("normal");
  };

  render() {
    const { modalVisible, pageStatus, savingBulkCourse } = this.props;
    const { dataSource, alertMsgStr } = this.state;

    if (pageStatus === "uploaded") {
      this.columns = [
        {
          title: "Course ID",
          dataIndex: "courseNo",
          render: (text, record) => {
            return (
              <React.Fragment>
                <StyledTableButton onClick={() => this.handleDeleteCourse(record.key)}>
                  <Icon type="delete" theme="twoTone" />
                </StyledTableButton>
                {record.courseNo}
              </React.Fragment>
            );
          }
        },
        {
          title: "Course Name",
          dataIndex: "courseName"
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (text, record) => {
            return (
              <React.Fragment>
                {record.status === "success" ? (
                  <StatusDiv>
                    <SuccessIcon type="check-circle" />
                    <SuccessP>{record.status}</SuccessP>
                  </StatusDiv>
                ) : (
                  <StatusDiv>
                    <AlertIcon type="close-circle" />
                    <AlertP>{record.statusMessage}</AlertP>
                  </StatusDiv>
                )}
              </React.Fragment>
            );
          }
        }
      ];
    } else if (pageStatus === "bulk-success") {
      this.columns = [
        {
          title: "Course Name",
          dataIndex: "courseName"
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (text, record) => {
            return <p>Course created successfully.</p>;
          }
        }
      ];
    }

    const columns = this.columns.map(col => {
      return {
        ...col
      };
    });

    let isError = false;
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].status === "error") isError = true;
    }

    let modalFooter = [
      <p>If you do not have a template</p>,
      <CSVLink filename={"courseUploadTemplate.csv"} data={[{ course_id: "", course_name: "" }]}>
        <Icon type="download" /> Download Template
      </CSVLink>
    ];
    if (pageStatus === "uploaded") {
      modalFooter = [
        <StyledConfirmButton type="primary" onClick={this.uploadCourse} disabled={isError || dataSource.length == 0}>
          Yes, the format looks correct
        </StyledConfirmButton>,
        <StyledConfirmButton onClick={this.goBackUpload}>go back and upload a new file</StyledConfirmButton>
      ];
    } else if (pageStatus === "bulk-success") {
      modalFooter = [
        <StyledConfirmButton onClick={this.goBackUpload}>Try your upload again</StyledConfirmButton>,
        <StyledConfirmButton type="primary" onClick={this.onCloseModal}>
          Done
        </StyledConfirmButton>
      ];
    } else if (pageStatus === "upload-novalidate-csv") {
      modalFooter = [<StyledConfirmButton onClick={this.goBackUpload}>Try your upload again</StyledConfirmButton>];
    }

    return (
      <StyledModal
        visible={modalVisible}
        title="Upload Course"
        onCancel={this.onCloseModal}
        maskClosable={false}
        width={"840px"}
        footer={modalFooter}
      >
        {(pageStatus === "normal" || pageStatus === "uploading") && (
          <React.Fragment>
            <StyledUploadBtn type="primary" ghost onClick={this.onUploadCSV} disabled={pageStatus !== "normal"}>
              <Icon type="upload" />
              <p>Upload Course</p>
            </StyledUploadBtn>
            <StyledUploadCSVDiv>
              <input
                ref={input => (this.inputElement = input)}
                type="file"
                onChange={this.handleCSVChange}
                accept=".csv"
              />
            </StyledUploadCSVDiv>
            <StyledSpin isVisible={pageStatus === "uploading"} size="large" />
          </React.Fragment>
        )}

        {pageStatus === "upload-novalidate-csv" && (
          <UploadedContent>
            <StyledAlert message={alertMsgStr} type="error" />
          </UploadedContent>
        )}

        {(pageStatus === "uploaded" || pageStatus === "bulk-success") && (
          <UploadedContent isBulkSuccess={pageStatus === "bulk-success"}>
            {pageStatus === "uploaded" && (
              <React.Fragment>
                <ConfirmP>Confirm the format</ConfirmP>
                {isError ? (
                  <AlertP>
                    Please ensure that your information appears correctly, please remove the rows with error status to
                    continue.
                  </AlertP>
                ) : (
                  <AlertP>Please ensure that your information appears correctly.</AlertP>
                )}
              </React.Fragment>
            )}
            {pageStatus === "bulk-success" && (
              <AlertSuccess>
                {dataSource.length} course(s) uploaded successfully and 0 course(s) failed to upload
              </AlertSuccess>
            )}
            <StyledTable dataSource={dataSource} columns={columns} pagination={false} />
            <StyledSpin isVisible={savingBulkCourse} size="large" />
          </UploadedContent>
        )}
      </StyledModal>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      uploadedCSVData: get(state, ["coursesReducer", "uploadCSV"], []),
      pageStatus: get(state, ["coursesReducer", "uploadModalPageStatus"], "normal"),
      savingBulkCourse: get(state, ["courseReducer", "saveingBulkCourse"], false)
    }),
    {
      uploadCSVCourse: uploadCSVAction,
      removeSelectedCourse: removeCourseOfUploadedAction,
      setPageStatus: setUpdateModalPageStatusAction,
      uploadBulkCourse: saveBulkCourseRequestAction
    }
  )
);

export default enhance(UploadCourseModal);
