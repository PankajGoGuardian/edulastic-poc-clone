import React from 'react'
import styled, { css } from 'styled-components'
import { white, title, lightGrey9 } from '@edulastic/colors'
import { IconMoveArrows, IconClose } from '@edulastic/icons'
import Draggable from '../MathInput/Draggable'

import h from './assets/Group9156.svg'
import li from './assets/Group9157.svg'
import be from './assets/Group9158.svg'
import na from './assets/Group9159.svg'
import mg from './assets/Group9160.svg'
import k from './assets/Group9161.svg'
import ca from './assets/Group9162.svg'
import rb from './assets/Group9163.svg'
import sr from './assets/Group9164.svg'
import cs from './assets/Group9165.svg'
import ba from './assets/Group9166.svg'
import fr from './assets/Group9167.svg'
import ra from './assets/Group9168.svg'
import sc from './assets/Group9169.svg'
import y from './assets/Group9170.svg'
import la from './assets/Group9171.svg'
import ac from './assets/Group9172.svg'
import ti from './assets/Group9173.svg'
import zr from './assets/Group9174.svg'
import hf from './assets/Group9175.svg'
import rf from './assets/Group9176.svg'
import ce from './assets/Group9177.svg'
import thi from './assets/Group9178.svg'
import v from './assets/Group9179.svg'
import nb from './assets/Group9180.svg'
import ta from './assets/Group9181.svg'
import dbi from './assets/Group9182.svg'
import pr from './assets/Group9183.svg'
import pa from './assets/Group9184.svg'
import cr from './assets/Group9185.svg'
import mo from './assets/Group9186.svg'
import w from './assets/Group9187.svg'
import sg from './assets/Group9188.svg'
import nd from './assets/Group9189.svg'
import u from './assets/Group9190.svg'
import mn from './assets/Group9191.svg'
import tc from './assets/Group9192.svg'
import re from './assets/Group9193.svg'
import bh from './assets/Group9194.svg'
import pm from './assets/Group9195.svg'
import np from './assets/Group9196.svg'
import fe from './assets/Group9197.svg'
import ru from './assets/Group9198.svg'
import os from './assets/Group9199.svg'
import hs from './assets/Group9200.svg'
import sm from './assets/Group9201.svg'
import pu from './assets/Group9202.svg'
import co from './assets/Group9203.svg'
import rh from './assets/Group9204.svg'
import ir from './assets/Group9205.svg'
import mt from './assets/Group9206.svg'
import eu from './assets/Group9207.svg'
import am from './assets/Group9208.svg'
import ni from './assets/Group9209.svg'
import pd from './assets/Group9210.svg'
import pt from './assets/Group9211.svg'
import ds from './assets/Group9212.svg'
import gd from './assets/Group9213.svg'
import cm from './assets/Group9214.svg'
import cu from './assets/Group9215.svg'
import ag from './assets/Group9216.svg'
import au from './assets/Group9217.svg'
import rg from './assets/Group9218.svg'
import tb from './assets/Group9219.svg'
import bk from './assets/Group9220.svg'
import zn from './assets/Group9221.svg'
import cd from './assets/Group9222.svg'
import hg from './assets/Group9223.svg'
import cn from './assets/Group9224.svg'
import dy from './assets/Group9225.svg'
import cf from './assets/Group9226.svg'
import b from './assets/Group9227.svg'
import c from './assets/Group9228.svg'
import n from './assets/Group9229.svg'
import o from './assets/Group9230.svg'
import f from './assets/Group9231.svg'
import ne from './assets/Group9232.svg'
import he from './assets/Group9233.svg'
import al from './assets/Group9234.svg'
import si from './assets/Group9235.svg'
import p from './assets/Group9236.svg'
import s from './assets/Group9237.svg'
import cl from './assets/Group9238.svg'
import ar from './assets/Group9239.svg'
import ga from './assets/Group9240.svg'
import ge from './assets/Group9241.svg'
import as from './assets/Group9242.svg'
import se from './assets/Group9243.svg'
import br from './assets/Group9244.svg'
import kr from './assets/Group9245.svg'
import inimg from './assets/Group9246.svg'
import tl from './assets/Group9247.svg'
import ho from './assets/Group9249.svg'
import es from './assets/Group9250.svg'
import sn from './assets/Group9251.svg'
import pb from './assets/Group9252.svg'
import fl from './assets/Group9253.svg'
import er from './assets/Group9254.svg'
import fm from './assets/Group9255.svg'
import sb from './assets/Group9256.svg'
import te from './assets/Group9257.svg'
import i from './assets/Group9258.svg'
import xe from './assets/Group9259.svg'
import bi from './assets/Group9260.svg'
import po from './assets/Group9261.svg'
import at from './assets/Group9262.svg'
import rn from './assets/Group9263.svg'
import mc from './assets/Group9264.svg'
import lv from './assets/Group9265.svg'
import ts from './assets/Group9266.svg'
import og from './assets/Group9267.svg'
import tm from './assets/Group9268.svg'
import yb from './assets/Group9269.svg'
import lu from './assets/Group9270.svg'
import md from './assets/Group9271.svg'
import no from './assets/Group9272.svg'
import lr from './assets/Group9273.svg'
import nh from './assets/Group9155.svg'

const aqua = '#00B1C7'
const teal = '#00C1AA'
const green = '#63CE65'
const mustard = '#F9E112'
const blue = '#009CD5'
const pink = '#C26CC7'
const purple = '#EE5289'
const corn = '#FFA73E'
const pumpkin = '#FF7449'
const red = '#FE5A55'

const PeriodicTable = ({ position, onInput, togglePeriodicTable }) => {
  const onClickButton = (text) => () => {
    onInput(`\\mathrm{${text}}`, 'write')
  }

  const handleClose = () => {
    setTimeout(() => {
      togglePeriodicTable()
    }, 100)
  }

  return (
    <Draggable position={position}>
      <Container>
        <TableHeader>
          <TableTitle>PeriodicTable</TableTitle>
          <TableAction>
            <IconMoveArrows color={lightGrey9} width={20} height={20} />
            <IconClose
              width={15}
              height={15}
              color={lightGrey9}
              onClick={handleClose}
            />
          </TableAction>
        </TableHeader>
        <Row>
          <Button bgColor={aqua} bg={h} onClick={onClickButton('H')} />
          <Spancer />
          <Button bgColor={blue} bg={he} onClick={onClickButton('He')} />
        </Row>
        <Row>
          <Button bgColor={pink} bg={li} onClick={onClickButton('Li')} />
          <Button bgColor={purple} bg={be} onClick={onClickButton('Be')} />
          <Spancer />
          <Button bgColor={teal} bg={b} onClick={onClickButton('B')} />
          <Button bgColor={aqua} bg={c} onClick={onClickButton('C')} />
          <Button bgColor={aqua} bg={n} onClick={onClickButton('N')} />
          <Button bgColor={aqua} bg={o} onClick={onClickButton('O')} />
          <Button bgColor={aqua} bg={f} onClick={onClickButton('F')} />
          <Button bgColor={blue} bg={ne} onClick={onClickButton('Ne')} />
        </Row>
        <Row>
          <Button bgColor={pink} bg={na} onClick={onClickButton('Na')} />
          <Button bgColor={purple} bg={mg} onClick={onClickButton('Mg')} />
          <Spancer />
          <Button bgColor={green} bg={al} onClick={onClickButton('Al')} />
          <Button bgColor={teal} bg={si} onClick={onClickButton('Si')} />
          <Button bgColor={aqua} bg={p} onClick={onClickButton('P')} />
          <Button bgColor={aqua} bg={s} onClick={onClickButton('S')} />
          <Button bgColor={aqua} bg={cl} onClick={onClickButton('Cl')} />
          <Button bgColor={blue} bg={ar} onClick={onClickButton('Ar')} />
        </Row>
        <Row>
          <Button bgColor={pink} bg={k} onClick={onClickButton('K')} />
          <Button bgColor={purple} bg={ca} onClick={onClickButton('Ca')} />
          <Button
            bg={sc}
            mr="12px"
            bgColor={corn}
            onClick={onClickButton('Sc')}
          />
          <Button bgColor={corn} bg={ti} onClick={onClickButton('Ti')} />
          <Button bgColor={corn} bg={v} onClick={onClickButton('V')} />
          <Button bgColor={corn} bg={cr} onClick={onClickButton('Cr')} />
          <Button bgColor={corn} bg={mn} onClick={onClickButton('Mn')} />
          <Button bgColor={corn} bg={fe} onClick={onClickButton('Fe')} />
          <Button bgColor={corn} bg={co} onClick={onClickButton('Co')} />
          <Button bgColor={corn} bg={ni} onClick={onClickButton('Ni')} />
          <Button bgColor={corn} bg={cu} onClick={onClickButton('Cu')} />
          <Button bgColor={green} bg={zn} onClick={onClickButton('Zn')} />
          <Button bgColor={green} bg={ga} onClick={onClickButton('Ga')} />
          <Button bgColor={teal} bg={ge} onClick={onClickButton('Ge')} />
          <Button bgColor={teal} bg={as} onClick={onClickButton('As')} />
          <Button bgColor={aqua} bg={se} onClick={onClickButton('Se')} />
          <Button bgColor={aqua} bg={br} onClick={onClickButton('Br')} />
          <Button bgColor={blue} bg={kr} onClick={onClickButton('Kr')} />
        </Row>
        <Row>
          <Button bgColor={pink} bg={rb} onClick={onClickButton('Rb')} />
          <Button bgColor={purple} bg={sr} onClick={onClickButton('Sr')} />
          <Button
            bg={y}
            mr="12px"
            bgColor={corn}
            onClick={onClickButton('Y')}
          />
          <Button bgColor={corn} bg={zr} onClick={onClickButton('Zr')} />
          <Button bgColor={corn} bg={nb} onClick={onClickButton('Nb')} />
          <Button bgColor={corn} bg={mo} onClick={onClickButton('Mo')} />
          <Button bgColor={corn} bg={tc} onClick={onClickButton('Tc')} />
          <Button bgColor={corn} bg={ru} onClick={onClickButton('Ru')} />
          <Button bgColor={corn} bg={rh} onClick={onClickButton('Rh')} />
          <Button bgColor={corn} bg={pd} onClick={onClickButton('Pd')} />
          <Button bgColor={corn} bg={ag} onClick={onClickButton('Ag')} />
          <Button bgColor={green} bg={cd} onClick={onClickButton('Cd')} />
          <Button bgColor={green} bg={inimg} onClick={onClickButton('In')} />
          <Button bgColor={green} bg={sn} onClick={onClickButton('Sn')} />
          <Button bgColor={teal} bg={sb} onClick={onClickButton('Sb')} />
          <Button bgColor={teal} bg={te} onClick={onClickButton('Te')} />
          <Button bgColor={aqua} bg={i} onClick={onClickButton('I')} />
          <Button bgColor={blue} bg={xe} onClick={onClickButton('Xe')} />
        </Row>
        <Row>
          <Button bgColor={pink} bg={cs} onClick={onClickButton('Cs')} />
          <Button bgColor={purple} bg={ba} onClick={onClickButton('Ba')} />
          <Button
            bg={la}
            mr="12px"
            bgColor={pumpkin}
            onClick={onClickButton('La')}
          />
          <Button bgColor={corn} bg={hf} onClick={onClickButton('Hf')} />
          <Button bgColor={corn} bg={ta} onClick={onClickButton('Ta')} />
          <Button bgColor={corn} bg={w} onClick={onClickButton('W')} />
          <Button bgColor={corn} bg={re} onClick={onClickButton('Re')} />
          <Button bgColor={corn} bg={os} onClick={onClickButton('Os')} />
          <Button bgColor={corn} bg={ir} onClick={onClickButton('Ir')} />
          <Button bgColor={corn} bg={pt} onClick={onClickButton('Pt')} />
          <Button bgColor={corn} bg={au} onClick={onClickButton('Au')} />
          <Button bgColor={green} bg={hg} onClick={onClickButton('Hg')} />
          <Button bgColor={green} bg={tl} onClick={onClickButton('Tl')} />
          <Button bgColor={green} bg={pb} onClick={onClickButton('Pb')} />
          <Button bgColor={green} bg={bi} onClick={onClickButton('Bi')} />
          <Button bgColor={green} bg={po} onClick={onClickButton('Po')} />
          <Button bgColor={teal} bg={at} onClick={onClickButton('At')} />
          <Button bgColor={blue} bg={rn} onClick={onClickButton('Rn')} />
        </Row>
        <Row>
          <Button bgColor={pink} bg={fr} onClick={onClickButton('Fr')} />
          <Button bgColor={purple} bg={ra} onClick={onClickButton('Ra')} />
          <Button
            bg={ac}
            mr="12px"
            bgColor={red}
            onClick={onClickButton('Ac')}
          />
          <Button bgColor={corn} bg={rf} onClick={onClickButton('Rf')} />
          <Button bgColor={corn} bg={dbi} onClick={onClickButton('Db')} />
          <Button bgColor={corn} bg={sg} onClick={onClickButton('Sg')} />
          <Button bgColor={corn} bg={bh} onClick={onClickButton('Bh')} />
          <Button bgColor={corn} bg={hs} onClick={onClickButton('Hs')} />
          <Button bgColor={mustard} bg={mt} onClick={onClickButton('Mt')} />
          <Button bgColor={mustard} bg={ds} onClick={onClickButton('Ds')} />
          <Button bgColor={mustard} bg={rg} onClick={onClickButton('Rg')} />
          <Button bgColor={green} bg={cn} onClick={onClickButton('Cn')} />
          <Button bgColor={mustard} bg={nh} onClick={onClickButton('Nh')} />
          <Button bgColor={mustard} bg={fl} onClick={onClickButton('Fl')} />
          <Button bgColor={mustard} bg={mc} onClick={onClickButton('Mc')} />
          <Button bgColor={mustard} bg={lv} onClick={onClickButton('Lv')} />
          <Button bgColor={mustard} bg={ts} onClick={onClickButton('Ts')} />
          <Button bgColor={mustard} bg={og} onClick={onClickButton('Og')} />
        </Row>
        <Row mt="10px">
          <Button />
          <Button />
          <Button mr="12px" />
          <Button bgColor={pumpkin} bg={ce} onClick={onClickButton('Ce')} />
          <Button bgColor={pumpkin} bg={pr} onClick={onClickButton('Pr')} />
          <Button bgColor={pumpkin} bg={nd} onClick={onClickButton('Nd')} />
          <Button bgColor={pumpkin} bg={pm} onClick={onClickButton('Pm')} />
          <Button bgColor={pumpkin} bg={sm} onClick={onClickButton('Sm')} />
          <Button bgColor={pumpkin} bg={eu} onClick={onClickButton('Eu')} />
          <Button bgColor={pumpkin} bg={gd} onClick={onClickButton('Gd')} />
          <Button bgColor={pumpkin} bg={tb} onClick={onClickButton('Tb')} />
          <Button bgColor={pumpkin} bg={dy} onClick={onClickButton('Dy')} />
          <Button bgColor={pumpkin} bg={ho} onClick={onClickButton('Ho')} />
          <Button bgColor={pumpkin} bg={er} onClick={onClickButton('Er')} />
          <Button bgColor={pumpkin} bg={tm} onClick={onClickButton('Tm')} />
          <Button bgColor={pumpkin} bg={yb} onClick={onClickButton('Yb')} />
          <Button bgColor={pumpkin} bg={lu} onClick={onClickButton('Lu')} />
          <Button />
        </Row>
        <Row>
          <Button />
          <Button />
          <Button mr="12px" />
          <Button bgColor={red} bg={thi} onClick={onClickButton('Th')} />
          <Button bgColor={red} bg={pa} onClick={onClickButton('Pa')} />
          <Button bgColor={red} bg={u} onClick={onClickButton('U')} />
          <Button bgColor={red} bg={np} onClick={onClickButton('Np')} />
          <Button bgColor={red} bg={pu} onClick={onClickButton('Pu')} />
          <Button bgColor={red} bg={am} onClick={onClickButton('Am')} />
          <Button bgColor={red} bg={cm} onClick={onClickButton('Cm')} />
          <Button bgColor={red} bg={bk} onClick={onClickButton('Bk')} />
          <Button bgColor={red} bg={cf} onClick={onClickButton('Cf')} />
          <Button bgColor={red} bg={es} onClick={onClickButton('Es')} />
          <Button bgColor={red} bg={fm} onClick={onClickButton('Fm')} />
          <Button bgColor={red} bg={md} onClick={onClickButton('Md')} />
          <Button bgColor={red} bg={no} onClick={onClickButton('No')} />
          <Button bgColor={red} bg={lr} onClick={onClickButton('Lr')} />
          <Button />
        </Row>
      </Container>
    </Draggable>
  )
}

export default PeriodicTable

const Container = styled.div`
  padding: 20px 26px 22px 26px;
  background: ${white};
  border-radius: 5px;
`

const TableTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${title};
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const TableAction = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin: 0px 4px;
  }
`

const Spancer = styled.div`
  margin: 0px auto;
`

const bgImageCss = css`
  &::after {
    content: ' ';
    width: 30px;
    height: 30px;
    top: 50%;
    left: 50%;
    display: block;
    background: ${({ bg }) => `url(${bg})`};
    position: absolute;
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-position: center;
  }
`

const Button = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 7px;
  cursor: pointer;
  margin-bottom: 2px;
  color: ${white};
  position: relative;
  margin-right: ${({ mr }) => mr || '2px'};
  background: ${({ bgColor }) => bgColor};

  ${({ bg }) => bg && bgImageCss}
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ mt: _mt }) => _mt};
`
