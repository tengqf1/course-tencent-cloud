<?php
/**
 * @copyright Copyright (c) 2021 深圳市酷瓜软件有限公司
 * @license https://opensource.org/licenses/GPL-2.0
 * @link https://www.koogua.com
 */

namespace App\Caches;

use App\Repos\ImGroup as ImGroupRepo;

class ImGroup extends Cache
{

    protected $lifetime = 365 * 86400;

    public function getLifetime()
    {
        return $this->lifetime;
    }

    public function getKey($id = null)
    {
        return "im_group:{$id}";
    }

    public function getContent($id = null)
    {
        $groupRepo = new ImGroupRepo();

        $group = $groupRepo->findById($id);

        return $group ?: null;
    }

}
