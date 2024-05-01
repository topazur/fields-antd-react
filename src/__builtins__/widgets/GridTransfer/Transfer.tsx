import { useCallback, useEffect } from 'react'
import cls from 'classnames'
import { Button, Spin } from 'antd'

import { usePrefixCls } from '../../hooks'
import { LeftOutlinedIcon, RightOutlinedIcon } from '../Icon'
import { TransferItem } from './TransferItem'
import { useSplitProps, useTransferDragStopped, useTransferGetRowId, useTransferReady, useTransferSelectionChanged } from './hooks'

import type { FC } from 'react'
import type { IGridTransferProps } from './types'

export const GridTransfer: FC<IGridTransferProps> = (props) => {
  const {
    rootClassName,
    className,
    style,
    loading = false,
    onChange,
    leftLayer,
    rightLayer,
    // callback
    onZoneDragEnd,
    leftOnZoneDragEnd,
    rightOnZoneDragEnd,
    onOperationEnd,
    leftOnOperationEnd,
    rightOnOperationEnd,
    ...restProps
  } = props

  const calcPrefixCls = usePrefixCls('grid-transfer', { prefixCls: 'fields' }, true)

  // 分隔 props
  const { leftProps, rightProps } = useSplitProps(restProps)

  // ready
  const {
    isReady,
    leftApiRef,
    rightApiRef,
    onLeftGridReady,
    onRightGridReady,
    refreshAll,
  } = useTransferReady(leftProps, rightProps)

  // 包装 onChange
  const onTargetChange = useCallback(() => {
    onChange?.({ api: rightApiRef.current!, type: 'drag' })
  }, [])

  // rowId
  const { getLeftRowId, getRightRowId } = useTransferGetRowId(leftProps, rightProps)

  // 复选框
  const {
    leftOperationDisable,
    rightOperationDisable,
    onLeftSelectionChanged,
    onRightSelectionChanged,
    leftIsRowSelectable,
    rightIsRowSelectable,
    onLeftRowSelected,
    onRightRowSelected,
  } = useTransferSelectionChanged(leftProps, rightProps)

  // 拖拽结束 - 刷新所有
  const {
    onLeftDragStopped,
    onRightDragStopped,
  } = useTransferDragStopped(leftProps, rightProps, refreshAll, onTargetChange)

  // 操作栏左侧
  const onLeftOperationHandler = useCallback(() => {
    const selectedRows = leftApiRef.current?.getSelectedNodes()

    const leftFn = leftOnOperationEnd ?? onOperationEnd
    leftFn?.({ nodes: selectedRows!, api: rightApiRef.current! }, leftApiRef.current!)

    rightApiRef.current?.refreshHeader?.()
    onChange?.({ api: rightApiRef.current!, type: 'operation' })
  }, [leftOnOperationEnd, onOperationEnd, onChange])

  const onRightOperationHandler = useCallback(() => {
    const selectedRows = rightApiRef.current?.getSelectedNodes()

    const rightFn = rightOnOperationEnd ?? onOperationEnd
    rightFn?.({ nodes: selectedRows!, api: leftApiRef.current! }, rightApiRef.current!)

    leftApiRef.current?.refreshHeader?.()
    onChange?.({ api: rightApiRef.current!, type: 'operation' })
  }, [rightOnOperationEnd, onOperationEnd, onChange])

  // drop zone
  useEffect(() => {
    if (!leftApiRef.current || !rightApiRef.current) { return }

    const leftFn = leftOnZoneDragEnd ?? onZoneDragEnd
    if (leftFn) {
      const l2rDropZoneParams = rightApiRef.current.getRowDropZoneParams({
        onDragStop(params) {
          leftFn(params, leftApiRef.current!)
        },
      })
      leftApiRef.current.removeRowDropZone(l2rDropZoneParams)
      leftApiRef.current.addRowDropZone(l2rDropZoneParams)
    }

    const rightFn = rightOnZoneDragEnd ?? onZoneDragEnd
    if (rightFn) {
      const r2lDropZoneParams = leftApiRef.current.getRowDropZoneParams({
        onDragStop(params) {
          rightFn(params, rightApiRef.current!)
        },
      })
      rightApiRef.current.removeRowDropZone(r2lDropZoneParams)
      rightApiRef.current.addRowDropZone(r2lDropZoneParams)
    }
  }, [isReady, leftOnZoneDragEnd, rightOnZoneDragEnd, onZoneDragEnd])

  return (
    <Spin spinning={loading}>
      <section
        className={cls(calcPrefixCls, rootClassName, className)}
        style={{ height: '100%', display: 'flex', columnGap: '10px', ...style }}
      >
        {/* 左边一栏为 source */}
        <div className={cls([`${calcPrefixCls}-item`])} data-direction="left" style={{ position: 'relative', flex: 1 }}>
          <TransferItem
            {...leftProps}
            onGridReady={onLeftGridReady}
            getRowId={getLeftRowId}
            isRowSelectable={leftIsRowSelectable}
            onRowSelected={onLeftRowSelected}
            onSelectionChanged={onLeftSelectionChanged}
            onDragStopped={onLeftDragStopped}
          />
          {leftLayer}
        </div>

        {/* 中间为左移右移操作栏 */}
        <span className={cls([`${calcPrefixCls}-split-item`])} style={{ display: 'flex', flexDirection: 'column', rowGap: '4px', justifyContent: 'center' }}>
          <Button
            type="primary"
            icon={<RightOutlinedIcon />}
            disabled={leftOperationDisable}
            onClick={onLeftOperationHandler}
          />
          <Button
            type="primary"
            icon={<LeftOutlinedIcon />}
            disabled={rightOperationDisable}
            onClick={onRightOperationHandler}
          />
        </span>

        {/* 右边一栏为 target */}
        <div className={cls([`${calcPrefixCls}-item`])} data-direction="right" style={{ flex: 1 }}>
          <TransferItem
            {...rightProps}
            onGridReady={onRightGridReady}
            getRowId={getRightRowId}
            isRowSelectable={rightIsRowSelectable}
            onRowSelected={onRightRowSelected}
            onSelectionChanged={onRightSelectionChanged}
            onDragStopped={onRightDragStopped}
          />
          {rightLayer}
        </div>
      </section>
    </Spin>
  )
}
