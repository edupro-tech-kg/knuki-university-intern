import React from "react";
import Button from "../../components/UI/Button";

const DocumentTable = ({
    data = [],
    config = {},
    onActionClick,
    className = "",
    buttonText = "Посмотреть",
    sectionTitle,
    mobileView = "cards",
    renderExtraContent,
    renderCellContent,
}) => {
    const {
        hasIndexColumn = true,
        hasActionColumn = true,
        actionType = "external",
        indexColumnWidth = "w-16",
        actionColumnWidth = "w-48",
        textColumnClass = "px-4 py-3 text-gray-700",
        borderClass = "border border-black",
        rowBorderClass = "border-b border-black last:border-b-0",
        hoverEffect = true,
        isGrouped = false,
        groupTitleKey = "title",
        groupItemsKey = "data",
        groupIdKey = "id",
        itemIdKey = "id",
        itemTextKey = "text",
        itemLinkKey = "link",
        itemPdfKey = "pdf",
        textSize = "text-base",
        showGroupTitleMobile = true,
        buttonVariant = "secondary",
        buttonClassName = "",
        showButtonIfNoAction = false,
    } = config;

    const getItemText = (item) => {
        if (typeof item === "string") return item;
        return item[itemTextKey] || item.title || item.text || "";
    };

    const getItemId = (item, index) => {
        if (item[itemIdKey] !== undefined) return item[itemIdKey];
        if (item.id !== undefined) return item.id;
        return index + 1;
    };

    const hasAction = (item) => {
        if (actionType === "pdf") {
            return item[itemPdfKey] || item.pdf;
        }
        if (actionType === "external") {
            return item[itemLinkKey] || item.link;
        }
        return true;
    };

    const handleActionClick = (item, index, event) => {
        if (onActionClick) {
            onActionClick(item, index, event);
        } else if (actionType === "pdf") {
            // PDF действия обрабатываются через onActionClick
        } else if (actionType === "external") {
            const link = item[itemLinkKey] || item.link;
            if (link) {
                window.open(link, "_blank", "noopener,noreferrer");
            }
        }
    };

    const renderActionButton = (item, index) => {
        if (!hasActionColumn) return null;
        if (!hasAction(item) && !showButtonIfNoAction) return null;

        const buttonLabel = typeof buttonText === "function"
            ? buttonText(item, index)
            : buttonText;

        return (
            <Button
                variant={buttonVariant}
                onClick={(e) => handleActionClick(item, index, e)}
                className={`px-6 py-2 text-sm ${buttonClassName}`}
                disabled={!hasAction(item)}
            >
                {buttonLabel}
            </Button>
        );
    };

    const renderItemContent = (item, index) => {
        if (renderCellContent) {
            return renderCellContent(item, index);
        }

        const text = getItemText(item);

        if (item.list && Array.isArray(item.list)) {
            return (
                <div>
                    <p className={`${textSize} text-gray-700 font-medium`}>{text}</p>
                    <ul className="list-disc pl-4 sm:pl-6 space-y-1 mt-2">
                        {item.list.map((li, idx) => (
                            <li key={idx} className={`${textSize} text-gray-700 pl-1`}>
                                {li}
                            </li>
                        ))}
                    </ul>
                    {item.footer && (
                        <p className={`mt-2 italic ${textSize} text-gray-600`}>
                            {item.footer}
                        </p>
                    )}
                </div>
            );
        }

        return <p className={`${textSize} text-gray-700`}>{text}</p>;
    };

    const renderTableRow = (item, index, isGroupHeader = false) => {
        if (isGroupHeader) {
            const colSpan = (hasIndexColumn ? 1 : 0) + 1 + (hasActionColumn ? 1 : 0);
            return (
                <tr key={`group-${item[groupIdKey] || index}`}>
                    <td
                        colSpan={colSpan}
                        className="py-3 sm:py-4 border-b border-t border-black bg-gray-50"
                    >
                        <div className="flex justify-center items-center">
                            <b className="text-base sm:text-lg md:text-xl text-center px-2 text-gray-800">
                                {getItemText(item)}
                            </b>
                        </div>
                    </td>
                </tr>
            );
        }

        const shouldShowAction = hasActionColumn && (hasAction(item) || showButtonIfNoAction);

        return (
            <tr
                key={getItemId(item, index)}
                className={`border-b border-black ${hoverEffect ? "hover:bg-gray-50" : ""}`}
            >
                {hasIndexColumn && (
                    <td
                        className={`${indexColumnWidth} px-4 py-3 text-center font-medium border-r border-black bg-white`}
                    >
                        {getItemId(item, index)}
                    </td>
                )}

                <td className={`${textColumnClass} ${shouldShowAction ? "border-r border-black" : ""} bg-white`}>
                    {renderItemContent(item, index)}
                </td>

                {shouldShowAction && (
                    <td className={`${actionColumnWidth} px-4 py-3 bg-white`}>
                        <div className="flex justify-end">
                            {renderActionButton(item, index)}
                        </div>
                    </td>
                )}
            </tr>
        );
    };

    const renderMobileCard = (item, index, isGroupHeader = false) => {
        if (isGroupHeader) {
            if (!showGroupTitleMobile) return null;

            return (
                <div
                    key={`group-mobile-${item[groupIdKey] || index}`}
                    className="bg-gray-100 py-3 px-4 rounded-lg mb-3 border border-gray-300"
                >
                    <h3 className="text-base sm:text-lg font-semibold text-center">
                        {getItemText(item)}
                    </h3>
                </div>
            );
        }

        const shouldShowAction = hasActionColumn && (hasAction(item) || showButtonIfNoAction);

        return (
            <div
                key={`mobile-${getItemId(item, index)}`}
                className="bg-white border border-gray-300 rounded-lg p-4 mb-4"
            >
                <div className="flex items-start gap-3 mb-3">
                    {hasIndexColumn && (
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium border border-gray-300">
                            {getItemId(item, index)}
                        </span>
                    )}
                    <div className="flex-1">
                        {renderItemContent(item, index)}
                    </div>
                </div>

                {shouldShowAction && (
                    <div className="flex justify-end pt-2">
                        {renderActionButton(item, index)}
                    </div>
                )}
            </div>
        );
    };

    const renderDesktopTable = () => {
        if (!isGrouped || !Array.isArray(data)) {
            return (
                <div className="border border-black">
                    <table className="min-w-full">
                        <tbody>
                            {data.map((item, index) => renderTableRow(item, index))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="border border-black">
                <table className="min-w-full">
                    <tbody>
                        {data.map((group, groupIndex) => {
                            const groupTitle = group[groupTitleKey];
                            const groupItems = group[groupItemsKey] || [];

                            return (
                                <React.Fragment key={`group-${group[groupIdKey] || groupIndex}`}>
                                    {renderTableRow({ [itemTextKey]: groupTitle }, groupIndex, true)}
                                    {groupItems.map((item, itemIndex) => 
                                        renderTableRow(item, itemIndex)
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderMobileCards = () => {
        if (!isGrouped || !Array.isArray(data)) {
            return data.map((item, index) => renderMobileCard(item, index));
        }

        return data.map((group, groupIndex) => {
            const groupTitle = group[groupTitleKey];
            const groupItems = group[groupItemsKey] || [];

            return (
                <React.Fragment key={`group-${group[groupIdKey] || groupIndex}`}>
                    {renderMobileCard({ [itemTextKey]: groupTitle }, groupIndex, true)}
                    {groupItems.map((item, itemIndex) => 
                        renderMobileCard(item, itemIndex)
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <div className={`${className}`}>
            {sectionTitle && (
                <h1 className="font-serif text-primary text-2xl sm:text-3xl md:text-4xl text-center py-6 md:py-9 uppercase italic">
                    {sectionTitle}
                </h1>
            )}
            
            <div className="block md:hidden">
                {renderMobileCards()}
            </div>

            <div className="hidden md:block">
                {renderDesktopTable()}
            </div>

            {renderExtraContent && (
                <div className="mt-6">
                    {renderExtraContent()}
                </div>
            )}
        </div>
    );
};

export default DocumentTable;