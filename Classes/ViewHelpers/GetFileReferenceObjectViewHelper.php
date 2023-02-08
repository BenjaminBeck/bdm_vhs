<?php
declare(strict_types=1);

namespace BDM\BdmVhs\ViewHelpers;

use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use Closure;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;

/**
 * UriViewHelper
 */
class GetFileReferenceObjectViewHelper extends \TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper
{
    protected $escapeOutput = false;
    protected $escapeChildren = false;

    /**
     * Initialize arguments
     */
    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('fileReferenceUid', 'int', '', true);
    }

    public static function renderStatic(
        array                     $arguments,
        Closure                   $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    )
    {
        $fileReference = GeneralUtility::makeInstance(ResourceFactory::class)->getFileReferenceObject($arguments['fileReferenceUid']);
        return $fileReference;
    }
}
