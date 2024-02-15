import styled from "styled-components";

const AttendanceStats = (props)=>{
    const {stats,marginTop,color,background} = props
let {totalAbsent=0,totalPresent=0,totalHalfDay=0,totalNotMarked=0,totalStudent=0} = stats
if(totalStudent>0 && totalNotMarked===0){
  totalNotMarked = totalStudent-(totalAbsent+totalPresent+totalHalfDay)
}
    return (<><TextWrapper marginTop={marginTop}>
          <Text color={color}>
          Total
          <HorizontalDivider background={background}/>
          <Count>{totalStudent}</Count>
        </Text><Divider background={background}/>
        <Text color={color}>
          Present
          <HorizontalDivider background={background}/>
          <Count>{totalPresent}</Count>
        </Text>
        <Divider background={background}/>
        <Text color={color}>
          Absent
          <HorizontalDivider background={background}/>
          <Count>{totalAbsent}</Count>
        </Text>
        <Divider background={background}/>
        <Text color={color}>
          Half Day
          <HorizontalDivider background={background}/>
          <Count>{totalHalfDay}</Count>
        </Text>
        <Divider background={background}/>
        <Text color={color}>
          Not Marked
          <HorizontalDivider style={{width: '75px'}} background={background}/>
          <Count>{totalNotMarked}</Count>
        </Text>
      </TextWrapper></>)
}
export default AttendanceStats

const TextWrapper = styled.div`
  display: flex;
  gap: 5px;
  margin-top:3px;
`;
const Text = styled.h3`
font-size: 12px;
    color: white;
    font-weight: bold;
`;
const Divider = styled.div`
  height: 43px;
  width: 3px;
  box-shadow: -1px 3px 4px 0px black;
  border-radius: 10px;
  border:1px solid white;
`;
const Count = styled.div`
  margin-top: 10px;
  text-align: center;
`;
const HorizontalDivider = styled(Divider)`
height: 3px;
width: 40px;
margin-top: 15px;
`

const StyledRuler = styled.hr``