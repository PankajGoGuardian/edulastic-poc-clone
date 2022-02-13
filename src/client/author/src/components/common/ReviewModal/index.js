const ReviewModalContent = () => {
  return (
    <StyledFlexContainer
      width="100%"
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDirection="column"
    >
      <SubHeader showRightPanel={showManageContent}>
        <div>
          <span>Based on Performance in</span>
          <StyledSelect
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .includes(input.trim().toLowerCase())
            }
            data-cy="select-assignment"
            style={{ minWidth: 200, maxWidth: 250 }}
            placeholder="SELECT ASSIGNMENT"
            onChange={(value, option) => handleAssignmentChange(value, option)}
            value={selectedTest}
          >
            {testData.map(({ _id, title }) => (
              <StyledSelect.Option key={_id} value={_id} title={title}>
                {title}
              </StyledSelect.Option>
            ))}
          </StyledSelect>
          <span>Recommendations For</span>
          <StyledSelect
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .includes(input.trim().toLowerCase())
            }
            data-cy="select-group"
            style={{ minWidth: 170, maxWidth: 280 }}
            placeholder="SELECT GROUP"
            onChange={(value, option) => handleClassChange(value, option)}
            value={
              selectedClass
                ? `${selectedClass.assignmentId}_${selectedClass.classId}`
                : undefined
            }
          >
            {classList.map(({ classId, className, assignmentId, title }) => (
              <StyledSelect.Option
                key={`${assignmentId}_${classId}`}
                value={`${assignmentId}_${classId}`}
                cName={className}
                assignmentId={assignmentId}
                classId={classId}
                title={title}
              >
                {className}
              </StyledSelect.Option>
            ))}
          </StyledSelect>
        </div>
        {!showManageContent && (
          <div>
            <EduButton
              isGhost
              height="35px"
              data-cy="manage-content"
              onClick={openManageContentPanel}
              style={{ marginRight: 22 }}
            >
              Customize Content
            </EduButton>
          </div>
        )}
      </SubHeader>
      <StyledFlexContainer width="100%" justifyContent="flex-start">
        <ContentContainer
          isDifferentiationTab
          showRightPanel={showManageContent}
          urlHasUseThis
        >
          <div>
            <WorkTable
              type="REVIEW"
              data-cy="review"
              data={differentiationWork.review}
              workStatusData={workStatusData.REVIEW || []}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              {...workTableCommonProps}
            />
          </div>
        </ContentContainer>
        {showManageContent && (
          <RightContentWrapper>
            {/* <SideButtonContainer style={{ paddingTop: 5 }}>
                Hiding this button for now as implementation is not done. 
              
              <EduButton isGhost height="35px" style={{ marginLeft: "0px" }}>
                Accept All Recommendations
              </EduButton> 
              
            
                <EduButton isGhost height="35px">
                Manage Content
              </EduButton>
              </SideButtonContainer> */}
            <HideRightPanel onClick={hideManageContentPanel}>
              <IconClose />
            </HideRightPanel>
            <ManageContentBlock isDifferentiationTab />
          </RightContentWrapper>
        )}
      </StyledFlexContainer>
    </StyledFlexContainer>
  )
}
