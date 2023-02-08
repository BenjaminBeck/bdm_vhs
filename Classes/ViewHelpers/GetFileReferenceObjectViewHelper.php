<?php
declare(strict_types=1);

namespace BDM\BdmVhs\ViewHelpers;

use BDM\BdmFegm\Domain\Repository\FrontendUserGroupRepository;
use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Resource\ResourceFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Service\ExtensionService;
use Closure;
use TYPO3\CMS\Extbase\Service\ImageService;
use TYPO3\CMS\Frontend\Resource\FileCollector;
use TYPO3\CMS\FrontendLogin\Service\UserService;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

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
